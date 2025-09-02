---
title: Async Rust 原语实现与品鉴
date: 2025-09-02
tags:
    - Rust
    - async
categories:
    - 天工开物
---

Rust 标准库的 `sync` 模块提供了一系列并发原语，包括对应原子操作的 `atomic` 系列，实现 channel 通信的 `mpsc` 和 `mpmc` 等，以及对应互斥锁的 `Mutex`、`RwLock` 和 `Condvar` 等。

不过，这些原语都是对应同步编程模型，基于线程阻塞来实现的。如果在 Future 和 async/await 上下文当中使用，可能会因为阻塞运行时调度而成为 Async Rust 的性能瓶颈。甚至 Rust 官方定义了一条 [Lints 规则](https://rust-lang.github.io/rust-clippy/master/index.html#await_holding_lock)，提示开发者不要跨越 await point 持有同步原语中的互斥锁资源。

换句话说，为了在 Async Rust 上下文中实现各种并发原语，我们必须在标准库 `sync` 模块以外另做实现。本文从 ScopeDB 开发过程中对并发原语的需求出发，介绍我们为此开发并开源的，运行时无关的异步并发原语库 **Mea (Make Easy Rust)**。

<!-- more -->

## Rust 语境下的异步并发原语

早在 ScopeDB 开始开发之前，Rust 生态就有一系列有名的并发原语库，例如：

* [crossbeam](https://github.com/crossbeam-rs/crossbeam) 提供了包括 channel 和 blocking queue 在内的一系列同步并发原语。
* [flume](https://github.com/zesterer/flume) 提供了同步和异步的 mpmc channel 通信并发原语。
* [oneshot](https://github.com/faern/oneshot) 提供了同步和异步的 oneshot channel 通信并发原语。
* [latches](https://github.com/mirromutth/latches) 提供了同步和异步的 CountDownLatch 并发原语。
* [waitgroup-rs](https://github.com/laizy/waitgroup-rs) 提供了对应 Go `sync.WaitGroup` 的异步并发原语。
* [tokio](https://github.com/tokio-rs/tokio) 的 `sync` 模块提供了包括 channel 和 Mutex 在内的一系列异步并发原语。
* [async-lock](https://github.com/smol-rs/async-lock) 提供了原 async-std 系的异步并发原语。

可以看到，每个并发原语库都有一个必备的属性，即判明它可以被用在同步编程模型下，还是异步编程模型，即 Async Rust 的上下文里。关于 Async Rust 实现的细节，可以参考我此前发布的文章[《Async Rust 的实现》](https://mp.weixin.qq.com/s/f2HuiL97ihiTZGmuvvOLjA)，这里直接说结论：异步并发原语和同步并发原语的关注点非常不同，完全是两个维度的工作，没有可比性。

一般而言，同步并发原语关注使用操作系统提供的原语，甚至指令集级别的原语，实现高效的共享状态访问。这通常涉及线程阻塞以及系统级别的信号响应，因此同步并发原语很多会对同一个操作提供 `do_sth(...)` 和 `do_sth_or_timeout(..., timeout)` 两种变体。相反，异步并发原语关键在于如何跟 Async Rust 的接口，尤其是 async/await 以及其底层 `Future::poll` 接口集成的问题。要想实现相同的 `do_sth_or_timeout` 逻辑，对于异步函数而言通常只需要组合两个 Future 即可：

```rust
select! {
    result = do_sth(...) => { ... }
    _ = timeout() => { ... }
}
```

其中 `timeout` 是一个返回在特定时间后完成的 Future 的异步函数。类似 tokio 和 fastimer 都提供了 `timeout(fut)` 函数，直接接收一个 Future 并将其包装为时限内完成或超时后返回 `Err` 的 Future 结构。

总而言之，异步并发原语其实并不直接处理传统意义上的同步操作。甚至，异步并发原语通常就是基于同步并发原语来搭建的。例如，tokio 和 mea 的异步 Mutex 原语实际是基于一个内部的同步 Semaphore 构建的。

所以，你可以看到 crossbeam 的原语只支持同步编程模型，tokio 和 async-lock 以及本文将具体介绍的 mea 库都只支持异步编程模型。至于那几个同时支持同步和异步的库，如果你仔细去看它们的实现，实际上它们也只是把两种不同的实现内容强行缝合在一个 crate 和似乎是同一个风格的 API 底下而已：要么是有一个 `do_sth` 和 `do_sth_async` 的方法分野，要么干脆就是两种不同的类型，其底下是相同或者不同的更基础的同步并发原语。

我在 mea 库的 README 文件里写到：

同步并发原语和异步并发原语的实现方法和优化方式非常不同。一般来说，只要实现了一个运行时无关的异步并发原语，可以很简单的通过组合这个原语和任何 Async Runtime 的 block_on 方法来获得一个效果还不错的同步实现。反过来，同步并发原语往往不能直接用在异步上下文当中，它们可能会利用一些特定于平台的功能，在同步并发模型中获得更好的性能。Mea 库专为异步代码设计，不考虑面向同步的优化。我经常发现那些试图同时提供同步和异步实现的库最终会设计出强行拼凑的接口，因此我倾向于独立实现同步和异步并发原语，而不是混在一起提供。

## 开发 Mea 库的动机

现在开始讲 ScopeDB 开发一个新的异步并发原语库的故事。

最开始的动机是为了在启动 ScopeDB Server 的时候，等待各个子模块的初始化完成后再对外提供服务。这是一个典型的 WaitGroup 的需求。

一开始，当然是先搜索开源生态里有没有现成的实现，于是我找到了 `waitgroup-rs` 库。由于 ScopeDB 使用的姿势比较简单，相当一段时间内我们都没用出什么问题来。不过 `waitgroup-rs` 毕竟是一个一次性开源的库，作者看起来并不打算长期维护。而且 WaitGroup 这样一个经典的需求，类似 Go 那样加入标准库都合情合理。于是我就向 Rust 官方的 futures-rs 库提出[添加 WaitGroup 实现的请求](https://github.com/rust-lang/futures-rs/issues/2880)。

没想到，futures-rs 的维护者 @taiki-e 不仅出于成熟度原因暂时不愿将 WaitGroup 吸纳到 futures-rs 库里，还指出了 `waitgroup-rs` 实现上的错误。由于 `waitgroup-rs` 的作者看起来不像要继续维护的样子，于是我动了手动维护一个分支的心思。

随后，ScopeDB 为了实现 Server 的优雅停机，又出现了 shutdown 时等待子模块退出的需求。起初，ScopeDB 选用了 tokio sync 模块的 `Notified` 原语实现，但是很快发现 `Notified` 的实现可能会遗漏消息，导致等待子模块已退出的的 Future 无限等待。其实，这个需求更像 Java 并发库里的 CountDownLatch 原语：全局共享一个计数器，对于 shutdown 的情况，这个计数是一。模块退出后将计数器减一，随后所有观察模块退出状态的线程都能看到计数器的值为零，从而结束等待执行其他操作。

于是，我很快找到了 `latches` 库，这个库就是仿照 C++、Java 和 Ruby 标准库的 CountDownLatch 原语，做了一个 Rust 的实现。实际用起来也没什么问题。但是这个库在实现上尝试同时实现同步和异步的 CountDownLatch 原语，导致其 feature flags 和 API 设计都比较不好理解。

这样，我就发现两个 ScopeDB 使用的异步并发原语存在代码优化的空间，再加上当时想把其他 tokio sync 的依赖，主要是异步环境下的 Mutex 依赖给去掉，我就开始了 mea 的开发。

Mea 提供的所有异步并发原语都是运行时无关的。这很正常，因为这些原语只依赖底层同步并发原语和 Future poll 接口的语义，跟任何运行时都无关。实际上，tokio sync 提供的原语也是运行时无关的，其代码中与 tokio runtime 互动和打点的部分是完全可选的。

在此之上，目前 Mea 实现的异步并发原语大致可以分为三类：

* 基于 CountDownState 或者更底层的 WaitSet 的对齐原语，英文语境下通常用 Synchronization Barrier 指称，包括 `Barrier`、 `Latch` 和 `WaitGroup` 这三个，还有一个组合原语 `ShutdownSend`/`ShutdownRecv` 配对。
* 基于同步信号量的原语，包括 `Semaphore`、`Mutex`、`RwLock` 和 `Condvar` 等。
* Channel 通信的原语，包括 `oneshot` 和 `bounded`/`unbounded` 的 `mpsc` 通道。

## 基于 CountDownState 的原语

Latch 和 WaitGroup 上一节的故事里做了介绍。实现 `Barrier` 的原因，一方面是这个原语在标准库 sync 模块里提供了，另一方面就是 async-std 还活着的时候，也提供一个异步的版本，而且这还是 @taiki-e 在讨论 WaitGroup 问题的时候举的例子。所以我就想，顺手实现一个看看。

这三个原语乍一看非常相似，都是多个线程或者说多个 Actor 之间就某个状态达成共识对齐，例如前面提到的 Server 启动和停止，或者更抽象的一批作业都完成后，等待的 Future 会返回 Poll::Ready 并执行后续动作。

其中，Latch 大致对应到 Java 的 `CountDownLatch` 或 C++ 的 `std::latch` 等；WaitGroup 大致对应到 Go 的 `sync.WaitGroup` 类型；Barrier 大致对应到 Java 的 `Phaser` 类型。

这三者语义的不同之处如下。

首先看到一个 WaitGroup 的使用示例：

```rust
let wg = WaitGroup::new();

for i in 0..3 {
    let wg = wg.clone();
    tokio::spawn(async move {
        println!("Task {} starting", i);
        tokio::time::sleep(Duration::from_millis(100)).await;
        // wg is automatically decremented when dropped
        drop(wg);
    });
}

// Wait for all tasks to complete
wg.await;
println!("All tasks completed");
```

可以看到，虽然在设计上参考了 Go 成熟的 `sync.WaitGroup` 类型，但是 Mea 版本的 WaitGroup 更好的使用了 Rust 的所有权系统，而不是像 Go 的同类一样依赖用户正确的调用 `Add` 和 `Done` 方法。

实现上，创建 WaitGroup 时，同步在等待的 Actor 数量为一。每次需要增加一个新的 Actor 时，调用 clone 方法产生一个新的 WaitGroup 实例，底层计数加一。实例所有权传递由 Rust 的底层机制保证。当作业完成时，WaitGroup 被 drop 掉，或者调用 `.await` 移交 WaitGroup 的所有权，底层计数减一。当且仅当所有 WaitGroup 实例被 drop 掉时，底层计数器归零，所有 await 点就绪。这样，资源的对齐就由 Rust 的所有权机制强制保证，而不依赖用户正确调用 `Add`、`Done` 和 `Wait` 方法。

此外值得一提的是，Mea WaitGroup 的实现充分考虑了 Rust 标准库定义的 IntoFuture trait 以及各种不同的需要直接操作底层 Future 的场景。这个实现得还挺典型的，各位可以直接看源码，了解 Async Rust Future 实现的最佳实践。

接下来看到 Latch 的使用示例：

```rust
let latch = Arc::new(Latch::new(3));
let mut handles = Vec::new();

for i in 0..3 {
    let latch = latch.clone();
    handles.push(tokio::spawn(async move {
        println!("Task {} starting", i);
        // Simulate some work
        latch.count_down(); // Signal completion
    }));
}

// Wait for all tasks to complete
latch.wait().await;
println!("All tasks completed");
```

乍一看结构和 WaitGroup 的示例大差不差。但是 Latch 的使用有两个关键的不同：

1. Latch 结构的共享需要套一层 Arc 来实现，自然也就没有 WaitGroup 那一堆依赖所有权机制 RAII 的内容。
2. Latch 创建时就要指定计数器的初始值，并且永远不会增加。相反，WaitGroup 初始值永远是 1 并且每次 clone 都会加一。

虽然也是一旦 CountDown 到零以后，所有 wait 点都就绪通过，但是 latch 的 wait 不会移交所有权，所以 Latch 计数到零的状态可以被多次观测到。

除此之外，Latch 还提供了 `arrive(n)` 一次 CountDown 多个计数，以及 `try_wait` 和 `wait_owned` 两个在不同的同步环境下使用的扩展接口。

对于 ScopeDB Server 启停同步这样的典型场景，我在多次组合使用 Latch 和 WaitGroup 之后，直接在 Mea 将这一实现固化成一个新的组合原语：

```rust
pub struct ShutdownSend {
    latch: Arc<Latch>,
    wait: Wait,
}

impl ShutdownSend {
    pub fn shutdown(&self) { self.latch.count_down(); }
    pub async fn await_shutdown(self) { self.wait.await; }
}

pub struct ShutdownRecv {
    latch: Arc<Latch>,
    #[expect(unused)] // hold the wait group
    wg: WaitGroup,
}

impl ShutdownRecv {
    pub fn is_shutdown_now(&self) -> bool { self.latch.try_wait().is_ok() }
    pub async fn is_shutdown(&self) { self.latch.wait().await; }
    pub fn is_shutdown_owned(&self) -> impl Future<Output = ()> + 'static {
        self.latch.clone().wait_owned()
    }
}

pub fn new_pair() -> (ShutdownSend, ShutdownRecv) {
    let latch = Arc::new(Latch::new(1));
    let wg = WaitGroup::new();
    let send = ShutdownSend {
        latch: latch.clone(),
        wait: wg.clone().into_future(),
    };
    let recv = ShutdownRecv { latch, wg };
    (send, recv)
}
```

这也是 WaitGroup 和 Latch 在使用上不同的一个展示。

最后是 Barrier 的使用示例：

```rust
let barrier = Arc::new(Barrier::new(3));
let mut handles = Vec::new();

for i in 0..3 {
    let barrier = barrier.clone();
    handles.push(tokio::spawn(async move {
        println!("Task {} before barrier", i);
        let result = barrier.wait().await;
        println!("Task {} after barrier (leader: {})", i, result.is_leader());
    }));
}

for handle in std::mem::take(&mut handles) {
    handle.await.unwrap();
}

// The barrier can be reused (generation is increased).
for i in 0..3 {
    let barrier = barrier.clone();
    handles.push(tokio::spawn(async move {
        println!("Task {} before barrier", i);
        let result = barrier.wait().await;
        println!("Task {} after barrier (leader: {})", i, result.is_leader());
    }));
}

for handle in handles {
    handle.await.unwrap();
}
```

可以看到，Barrier 主要的特点就是可以多次对齐，并且由于经常被用于多个 Actor 对齐后运行特定逻辑，所以标准库的 Barrier 给 wait 方法附上了一个当前 Actor 是否是 leader 的信息。这个 leader 决定的方法理论上是不透明的，但是实际上因为没什么特别的要求，出于实现效率考虑一般都非常简单，比如 Mea 就采取最后到齐的人是 leader 的策略。

最后，值得一提的是，不同于 Go 和 Java 经常为这类同步原语提供注册回调的方法，用以在同步点到达时自动 callback 注册的逻辑，Rust 采用的 async/await 编程模型从设计上就可以简单的组合，例如上面的代码当中，一旦 `.await` 返回，开发者可以马上在下面把原本应该是传入 callback 的函数逻辑接上，实现同样的 callback 效果。因此，async/await 编程模型不会有回调地狱的问题。

## 基于 Semaphore 的原语

Mea 实现的另外一部分原语，就是大部分开发者熟悉的互斥锁。以下是一个典型的互斥锁程序：

```rust
let mutex = Arc::new(Mutex::new(0));
let mut handles = Vec::new();

for i in 0..3 {
    let mutex = mutex.clone();
    handles.push(tokio::spawn(async move {
        let mut lock = mutex.lock().await;
        *lock += i;
    }));
}

for handle in handles {
    handle.await.unwrap();
}

let final_value = mutex.lock().await;
assert_eq!(*final_value, 3); // 0 + 1 + 2
```

关于锁的语义应该不用太多讨论，这里主要分享一些实现上的重要细节。

首先吐槽一下其他广泛实现的库实现，但凡它们实现得好一点，我都不同再搞一遍然后踩一轮相似的坑。首当其冲的就是标准库里的 Mutex 每次加锁都会返回 `LockResult` 结果，于是开发者经常要 `mutex.lock().unwrap()` 或者为了避免 panic 用更不好评价的 `lock().unwrap_or_else(PoisonError::into_inner)` 写法。

这个就是完全的设计错误，而且背离了 Rust 所谓零成本抽象的“金科玉律”[^1]。其中的原理我会放一些参考链接，这里不做展开。但是从开发者角度看，完全无法理解自己看到一个 PoisonError 的时候能做什么，实际上就是什么也做不了，而且很多时候我只管能拿到锁，哪管你这个那个的。这里的设计就是把两个不同层面的事情（是否拿到锁 / 持有锁的过程中修改状态是否正确）绑定都一起，简直莫名其妙。现在，Rust 标准库上游有若干个 Tracking Issue 正在为这笔烂账买单，而 Mea 的 Mutex 跟其他所有正常的互斥锁实现一样，从一开始就没有这个问题，所以你看到上面写的是 `mutex.lock().await` 而没有任何 unwrap 的调用。

* [Notes On Lock Poisoning](https://matklad.github.io/2020/12/12/notes-on-lock-poisoning.html)
* [Tracking Issue for sync_poison_mod](https://github.com/rust-lang/rust/issues/134646)
* [Tracking Issue for sync_nonpoison and nonpoison_{condvar,mutex,once,rwlock}](https://github.com/rust-lang/rust/issues/134645)

[^1]: 我个人认为 Rust 对零成本抽象的执著超出了正常范围，有些成本是值得的。但是 LockResult 这个设计真的毫无道理。

另一个是我说服自己 tokio sync 的锁也有问题的点，即它是基于一个内部的同步 Semaphore 实现的，而这个 Semaphore 的实现又被复用在了 channel 里面，导致它有一个莫名其妙的 close 功能。为了支持这个 close 功能，tokio 的 Semaphore 和 RwLock 的原语都不能利用满 usize 的 permits 而是要有一些奇怪的限制。那从底层解决这个问题，上层的原语自然也要重新实现一遍。

具体来说，在 Mea 的设计里，Semaphore 创建时信号量的值可以是 usize::MIN 到 usize::MAX 的任何值，而且所有跟 permits 相关的接口用的都是 usize 类型。tokio 不是这样的。它的 Semaphore 创建和操作时，如果 permits 超过上限 usize::MAX >> 3 就会 panic 退出。同理 RwLock 的读者 permits 超过 u32::MAX >> 3 也会爆炸。

欸，你是不是发现同一个 Semaphore 的基建，为什么高级原语一个用 usize 一个用 u32 呢？这就对了。tokio 的 Semaphore 跟 permits 相关的接口，一会儿 u32 一会儿 usize 的，而且明明 acquire(1) 和 acquire(n) 可以是一个接口，它一定要分成 acquire() 和 acquire_many(n) 两个接口，导致代码量和复杂度都增加。由于 tokio 已经 1.0 并且被 Rust 生态大规模使用，我想上游应该是完全没有想法再做改动了，毕竟也不是不能用。

最后，tokio 的 forget 实现是有问题的。这个在 Mea 库里我实现的 forget 和 forget_exact 两个方法来对应不同削减 permits 的语义。具体来说，tokio 的 forget(n) 方法，在当前 Semaphore available permits 耗尽后，就什么也不做，而 Mea 的 forget_exact 方法，会在这个时候往 Semaphore 等待队列的最前端挂一个消耗掉剩余应当削减的 permits 的节点，保证用户说减掉 n 个 permits 就是减掉了 n 个 permits 的效果。

这里就进到关于信号量和互斥锁实现的细节了。总的来说，Mea 的设计大体是仿照 tokio 的实现来的，即依赖一个完全公平调度的等待队列。所有想要获取信号量的 Actor 都按先进先出的顺序进入队列，每个人说明自己想要获取的信号量数目，在信号量有剩余或者有其他 Actor release 的情况下，从前往后逐步满足等待者的要求。如果信号量不足，则等待者将一直等待。

对于用户可见的原语，最基础的 Semaphore 实现提供了一对一映射的 release 和 acquire 方法，当然还包括了上面提到的 forget 和 forget_exact 方法。其中，acquire 方法返回一个 SemaphorePermit 结构，这个结构基于 Rust RAII 机制在 drop 时归还其上占有的 permits 资源。此外，为了绕过跨线程传递 permits 时跟生命周期相关的问题，Semaphore 提供了 acquire_owned 等一系列 owned 方法来避免生命周期检查的局限。

对于典型的互斥锁原语，其对应的是一个初始值为一的信号量。每次调用 lock 方法就对应着 acquire(1) 操作，拿着 MutexGuard 的时候就是拿着 permits 资源，Guard drop 时会自动释放并归还 permits 资源。类似的，Mutex 也有 lock_owned 等方法获取没有生命周期参数的锁资源。

对于读写锁 RwLock 原语，其对应的是一个初始值为最大读者数量的信号量。每次调用 read 方法就对应着 acquire(1) 操作，调用 write 方法就对应着 acquire(max_readers) 操作。其他内容与 Mutex 基本一一对应。

近期，在 @orthur2 大佬的帮助下，Mea 的锁原语还支持了 map/filter_map 和写锁的 downgrade 等功能。

![Mea 的开源协同这下好起来了](contributions.png)

最后，条件变量 Condvar 通常和互斥锁 Mutex 一起使用。一个典型的示例如下：

```rust
let pair = Arc::new((Mutex::new(false), Condvar::new()));
let pair_clone = pair.clone();

// Inside our lock, spawn a new thread, and then wait for it to start.
tokio::spawn(async move {
    let (lock, cvar) = &*pair_clone;
    let mut started = lock.lock().await;
    *started = true;
    // We notify the condvar that the value has changed.
    cvar.notify_one();
});

// Wait for the thread to start up.
let (lock, cvar) = &*pair;
let mut started = lock.lock().await;
while !*started {
    started = cvar.wait(started).await;
}
```

当调用 `cvar.wait` 时，条件变量取出 MutexGuard 当中的 Mutex 引用，通过 drop guard 允许其他互斥锁抢到资源，随后在初始值为零的独立信号量上等待，直到另一个抢到锁的 Actor 执行完任务后调用 notify_one 或 notify_all 函数唤醒自身，随后尝试重新获取锁，直到获取锁成功，返回 MutexGuard 到调用点。通过这样一套同步机制，Condvar 能够保证不同的持有互斥锁的 Actor 直接就特定状态达成一致。

## Channel 通信的原语

为了取缔 tokio sync 的所有功能，Mea 还提供了 oneshot 和 mpsc 两个 Channel 通信的原语。

其中 oneshot 原语基本就是复刻了 `oneshot` 库的实现。但是由于完全不用考虑同步编程环境，也即线程阻塞流派的写法，整个状态机可以进一步简化，同时也没有其他一些 feature flags 和接口误解的问题。以下是 oneshot channel 的典型用例：

```rust
let (tx, rx) = oneshot::channel();

tokio::spawn(async move {
    if let Err(_) = tx.send(3) {
        println!("the receiver dropped");
    }
});

match rx.await {
    Ok(v) => println!("got = {:?}", v),
    Err(_) => println!("the sender dropped"),
}
```

顾名思义，oneshot 就是只发送一次，也只能至多成功接收一次，所以 send 和等效于 recv 的 `.await` 调用都是移动所有权的。

至于 mpsc channel 原语，它实现的是可以有多个生产者，但是只有一个消费者的语义（MPSC=Multiple Producer, Single Consumer）。一个典型的用法如下：

```rust
let (tx, mut rx) = mpsc::unbounded();

let start = Instant::now();
tokio::spawn(async move {
    for i in 0..n {
        tx.send(i).unwrap();
    }
});

for i in 0..n {
    assert_eq!(rx.recv().await, Some(i));
}

let (tx, mut rx) = mpsc::bounded(1);
tx.send(1).await.unwrap();
// This will block until the receiver is ready to receive.
tokio::spawn(async move {
    tx.send(2).await.unwrap();
});
assert_eq!(Some(1), rx.recv().await);
assert_eq!(Some(2), rx.recv().await);
assert_eq!(None, rx.recv().await);
```

可以看到，为了约束只有一个消费者的语义，recv 方法需要一个可变引用。对于无界通道来说，send 永远成功，因此是同步方法；而对于有界通道来说，send 可能需要等待 buffer 空出位置，可能会“阻塞”，因此是异步方法，需要 await 驱动。

我在实现 mpsc 的时候，先是想参考 tokio 或者 futures-rs 的实现，但是它们的实现都非常复杂，实际的效率其实也算不上多好。随后，我发现了本文最前面提到的，异步并发原语实际上是跟 Async Rust 的接口打交道，而不是真的要做什么同步基础实现。这下思路打开，我直接在 std sync 的 mpsc 上包了一层异步的 mpsc 实现，而且实测性能比 tokio 还要好一些。

关于 Channel 的实现，还有三个小故事值得分享。

其一是在包装 std 的 mpsc 时，我需要一个跟 AtomicWaker 类似的能力，以在 send 成功时唤醒潜在等待的 recv 调用。本来我想直接用 atomic-waker 库，而且我想他们是不是可以进标准库，可是 @taiki-e 老哥突然自爆说他觉得 [atomic-waker 不行](https://github.com/rust-lang/futures-rs/issues/2955)，搞得我也有点尴尬。你说直接用吧，其实没啥问题，但是就让人忍不住想找找看有没有别的替代，于是找到了 [atomicbox](https://github.com/jorendorff/atomicbox) 这个库。但是 atomicbox 好像不维护了，在接口上也有一些问题，我于是把它拿到了 Mea 里维护起来，主要是为了 mpsc 使用，但是也不妨作为公开的原语发布。这里还有一些跟[内存屏障和原子操作相关的问题](https://github.com/fast/mea/pull/60)，有待后续优化。

其二是在实现 bounded mpsc 的时候，我先流畅的搞定了 buffer > 0 的实现，然后就想 buffer = 0 是不是也能跟 std 的 mpsc 一样做出来。但是最后发现[语义怎么都不太对](https://github.com/fast/mea/issues/57)，不是不能强行实现，但是有些边界语义说不出的诡异，于是就放弃了。所以说，同步并发原语和异步并发原语还是很不一样的。

![“关于 Async Rust 风格标准的讨论”](difference.jpeg)

其三是 Mea 的 mpsc 实现跟 futures-rs 里的 Sink trait 不是很兼容。关于 Sink trait 的吐槽如果我提到 Async Rust 的接口设计和 combinator 的时候，可能会做一个详细的展开，但是这里我可以援引前 async-std 团队在 futures-lite 库里的一个锐评：

![任何看过 Sink trait 定义的人都会沉默](sink.png)

## Mea 命名的缘由

最后，作为一个趣闻分享，讲一下 Mea 命名的来由。

字面上看是 Make Easy Async 的意思，不过这个其实语法上是不通的。我是先选了 Mea 这个名字，再去找补的看起来想那么回事的意义。实际上选择这个名字，当然是为了致敬某个名字就叫 Mea 的数字生命。

![Please Money](please.jpg)

在写作本文的过程里，我还意外发现这个名字跟奠定了 Java 并发编程基础的 Doug Lea 有点相似，也算是另一个巧合了。

## Async Rust 的未来

我经常吐槽 Async Rust 的基础设施建设一团糟，目前几乎没有正经的 Core Team 或者 Lib Team 的开发者在搞这一块的工作。2022 年前后我的前同事 Nick Cameron 想要重回 wg-async 做一番事业，最后无奈铩羽而归。

Async Rust 目前实质上的标准就是 tokio 生态。应该说 tokio runtime 能用，而且客观评价还不错。但是整个 tokio team 就充满了一种不确定的气息，在此前关于 Fastrace 的文章里我们也可以看到 tokio 系的 tracing 库是如何的不靠谱。这种不靠谱是广泛存在的，而且 tokio 团队看起来没有任何标准化的动力。

Async Rust 实际上包括至少四个理论上可以相互独立开发的模块：

1. 异步并发原语，即这里介绍的内容，这个是运行时无关的。
2. 通用接口定义和组合子，即 AsyncRead 和 StreamExt 这样的内容，这个也是运行时无关的。
3. IO 驱动器，即 tokio 最核心的不可替代的能力。
4. 任务调度器，这个 tokio 实现成和 IO 驱动器强耦合的形式，其他竞争软件比如 compio 也是类似的，但实际上任务调度器可以独立实现，例如 TiKV 的 YATP 就不耦合 IO 驱动器。

其他还有一些底层的事件，比如 Timer 和 Signal 等等，也可以归类到 IO 驱动器的大类里。

未来我可能会写文章讨论这其中的更多细节，但是目前我主要想为 1 和 2 提供更好的实现，并探索和尝试实现独立的 IO 驱动器。当然，更重要的是在 Rust 生态里达成共识，形成一些标准做法和标准选择，避免生态进一步割裂，导致大家开发的异步库比较难做到充分可移植。
