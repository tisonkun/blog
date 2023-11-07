---
title: Async Rust 的实现
date: 2023-11-05
tags:
    - Rust
    - Async
categories:
    - 天工开物
---

绝大多数第一次接触 Async Rust 的开发者所写的 Hello World 程序是下面这样的：

```rust
async fn say_world() {
    println!("world");
}

#[tokio::main]
async fn main() {
    // Calling `say_world()` does not execute the body of `say_world()`.
    let op = say_world();
    // This println! comes first
    println!("hello");
    // Calling `.await` on `op` starts executing `say_world`.
    op.await;
}
```

目前最流行的 Rust Async Runtime [tokio](https://tokio.rs/) 告诉你，只要在 main 函数前加上 `#[tokio::main]` 这个咒语，再把 main 函数定义成一个 `async fn` 函数，就可以在程序的任何地方用 `async fn` 和 `.await` 语法享受到并发编程的免费午餐了。

但是，这样的解释显然不足以满足相信 Rust 尽可能显式表达所有开销的哲学的人；也就是说，到底 async fn 里的逻辑是怎么被执行的，代码中出现 `.await` 的时候，Rust 程序实际在执行什么动作。

本文基于具体的异步运行时和并发库代码，介绍支持 Rust 并发模型工作的核心概念。

<!-- more -->

## Async Runtime

Rust 语言是一门系统级编程语言，这意味着 Rust 程序不像 Node.js 程序那样自带运行时。这不仅意味着没有全局管理内存的垃圾回收器，也意味着没有一个全局默认的异步任务运行时。

例如，以下 Node.js 代码会打印出 Hello world 字串：

```javascript
(async function() { console.log('Hello world'); })()
```

而相似的 Rust 代码却不会有任何输出：

```rust
async { println!("Hello world") };
```

Rust 编译器提示：

```text
note: futures do nothing unless you `.await` or poll them
```

如果在上述代码后加入 `.await` 调用：

```rust
async { println!("42") }.await;
```

编译会直接报错：

```text
`await` is only allowed inside `async` functions and blocks
```

编译器提示 `.await` 只能在 `async` 代码块里使用，我们尝试把 main 函数改成 async 函数：

```rust
async fn main() {
    async { println!("Hello world") }.await
}
```

编译器同样报错：

```text
`main` function is not allowed to be `async`
```

我们回过头看 tokio 的示例，再添加了 `#[tokio::main]` 以后，似乎 main 函数就可以写成 `async fn main` 了，也能用 `.await` 触发 Future 计算了。

查看 tokio 的文档，可以知道 `#[tokio:main]` 实际上是一个过程宏，它会把 `async fn main` 展开成：

```rust
fn main() {
    tokio::runtime::Builder::new_multi_thread()
        .enable_all()
        .build()
        .unwrap()
        .block_on(async {
            println!("Hello world");
        });
}
```

由此，我们知道，在 Rust 程序里要想执行 async 块里的并发代码，我们需要先构造一个 Async Runtime 的实例，再调用类似 `block_on` 的方法来驱动并发计算执行。

## Simplest Runtime

tokio 为我们提供了一个功能完备的异步运行时。然而，tokio 的实现也是极其复杂的。要想理解 Rust 异步运行时的执行逻辑，我们可以先实现一个最简单的异步运行时：

```rust
struct ThreadWaker(Thread);
impl Wake for ThreadWaker {
    fn wake(self: Arc<Self>) {
        self.0.unpark();
    }
}

fn block_on<F: Future>(fut: F) -> F::Output {
    let mut fut = pin!(fut);
    let t = thread::current();
    let waker = Arc::new(ThreadWaker(t)).into();
    let mut cx = Context::from_waker(&waker);
    loop {
        match fut.as_mut().poll(&mut cx) {
            Poll::Ready(res) => return res,
            Poll::Pending => thread::park(),
        }
    }
}
```

应用代码如下：

```rust
fn main() {
    block_on(async { println!("Hello world") });
}
```

这时，我们编译运行代码，可以看到屏幕正常输出 Hello world 字串。

我们来看一看上述代码实际执行了什么动作：

1. async 代码块构造了一个并发计算闭包，返回一个 Future trait 的实例。
2. 这个 Future 被传到 block_on 函数里，用 `pin!` 宏构造了符合 poll 方法要求的 Pin 实例。
3. block_on 函数内，构造了一个 ThreadWaker 实例，持有当前线程的引用。
4. 从 ThreadWaker 示例调用一系列构造器构造出 poll 方法需要的 Context 实例。
5. 调用 poll 方法，在本示例中，首次调用就会执行 println 动作并返回 `Poll::Ready(())` 结果，于是 block_on 函数返回。

我们把这个例子稍微写复杂一点，把异步代码块从简单打印一个字符串，改为一个类似 Timer 的逻辑：

```rust
struct MyFuture {
    id: u32,
    start: Instant,
    duration: Duration,
}

impl Future for MyFuture {
    type Output = ();

    fn poll(self: Pin<&mut Self>, cx: &mut Context<'_>) -> Poll<Self::Output> {
        println!("Polling {} {}", self.id, chrono::Utc::now());
        let now = Instant::now();
        let expect = self.start + self.duration;
        let id = self.id;
        if expect > now {
            let duration = expect - now;
            let waker = cx.waker().clone();
            thread::spawn(move || {
                sleep(duration);
                println!("Wake up {id} {}", chrono::Utc::now());
                waker.wake();
            });
            println!("Pending {id} {}", chrono::Utc::now());
            Poll::Pending
        } else {
            println!("Ready {id} {}", chrono::Utc::now());
            Poll::Ready(())
        }
    }
}

fn main() {
    println!("Start {}", chrono::Utc::now());
    block_on(MyFuture {
        id: 1,
        start: Instant::now(),
        duration: Duration::from_secs(10),
    });
    println!("Finish {}", chrono::Utc::now());
}
```

输出内容如下：

```text
Start 2023-11-05 09:53:03.202626 UTC
Polling 1 2023-11-05 09:53:03.203152 UTC
Pending 1 2023-11-05 09:53:03.203222 UTC
Wake up 1 2023-11-05 09:53:13.206258 UTC
Polling 1 2023-11-05 09:53:13.206370 UTC
Ready 1 2023-11-05 09:53:13.206396 UTC
Finish 2023-11-05 09:53:13.206407 UTC
```

可以看到，两次 Polling 之间间隔了十秒钟。实际执行的内容如下：

1. 同上 block_on 函数第一次调用 poll 方法，这次 poll 返回了 `Poll::Pending` 结果，于是 block_on 阻塞在 `thread::park()` 上。该方法用同步原语信号量阻塞当前线程，并等待其他线程调用 unpark 唤醒内部信号量。
2. poll 方法返回 Pending 前，从 Context 里取得 Waker 实例，并启动一个新线程，在十秒后调用 `waker.wake()` 方法。
3. wake 方法调用即调用 `self.0.unpark()` 方法，于是第一步里阻塞的线程恢复执行，在 loop 中再次调用 MyFuture 的 poll 方法，此时时间已经超过预计等待时间，方法返回 `Poll::Ready(())` 结果，block_on 方法也返回。

Simplest Runtime 在 crates.io 上有一个完整的实现 [pollster](https://docs.rs/pollster) 运行时。这个运行时的[核心代码](https://github.com/zesterer/pollster/blob/58f420e1ac19def81183ca4140470e4bb956fd11/src/lib.rs)同样极其简短，不超过一百行。

## Waker API

上面这个例子解释了在 Rust 的 Future API 中神秘的 Context 参数和它唯一传递的 Waker 实例的作用：Waker 实际上就是一个回调闭包，使用 `wake` 或 `wake_by_ref` 执行通知异步运行时可以再次调度当前 Future 计算。

[waker-fn](https://docs.rs/waker-fn) 库提供了闭包到 Waker API 的适配器，这直观地展示了 Waker 就是一个回调闭包：

```rust
pub fn waker_fn<F: Fn() + Send + Sync + 'static>(f: F) -> Waker {
    Waker::from(Arc::new(Helper(f)))
}

struct Helper<F>(F);

impl<F: Fn() + Send + Sync + 'static> Wake for Helper<F> {
    fn wake(self: Arc<Self>) {
        (self.0)();
    }

    fn wake_by_ref(self: &Arc<Self>) {
        (self.0)();
    }
}
```

那么，为什么 Rust 要在 FnOnce 和 Fn 之外设计 Waker API 呢？我们看到 Waker 的定义：

```rust
pub struct Waker {
    waker: RawWaker,
}

pub struct RawWaker {
    data: *const (),
    vtable: &'static RawWakerVTable,
}

pub struct RawWakerVTable {
    clone: unsafe fn(*const ()) -> RawWaker,
    wake: unsafe fn(*const ()),
    wake_by_ref: unsafe fn(*const ()),
    drop: unsafe fn(*const ()),
}

impl Waker {
    pub fn wake(self) {
        let wake = self.waker.vtable.wake;
        let data = self.waker.data;
        crate::mem::forget(self);
        unsafe { (wake)(data) };
    }

    pub fn wake_by_ref(&self) {
        unsafe { (self.waker.vtable.wake_by_ref)(self.waker.data) }
    }
}
```

RawWaker 中的 `data` 字段，内容就是 Waker 本身。这跟我们常见的 Safe Rust 有很大的区别。它使用了等价于 `void*` 的 `*const ()` 以及一系列方法引用构成 VTable 来组成 RawWaker 进而构成 Waker 实例，从而在类型签名中把类型参数或生命周期标记给抹掉。

这样，Rust 的 Async API 可以直接传递 struct Waker 的实例，而不是 `Box<dyn Fn()>` 或 `Box<dyn FnOnce()>` 等。但是，后者编译时会被 Rust 编译器在生命周期和是否 Send 等类型约束上不停折磨，甚至有些代码表达不出来。

由于我们此时知道 Waker 对应的回调一定是可用的，所以 Rust 的 Async API 选择使用 VTable 和 unsafe 来实现躲过编译器检查的 `Box<dyn Fn()>` 的类型。

## Simplest Parallel Runtime

上述异步运行时实现里，我们观察到了异步代码被 poll 的过程，但是这跟常见的通过并发实现并行，同时执行多个任务还是有所出入。

我们对 block_on 的代码稍作改动，把阻塞在当前线程的行为改为每次传入一个新的 Future 实例，就启动一个新线程来驱动执行，同时，将函数名改为 `spawn` 以体现出这种行为的改变：

```rust
fn spawn<F>(fut: F) -> Receiver<F::Output>
    where F: Future + Send + 'static,
          F::Output: Send,
{
    let (tx, rx) = mpsc::channel();
    thread::spawn(move || {
        let mut fut = pin!(fut);
        let t = thread::current();
        let waker = Arc::new(ThreadWaker(t)).into();
        let mut cx = Context::from_waker(&waker);
        loop {
            match fut.as_mut().poll(&mut cx) {
                Poll::Ready(res) => {
                    let _ = tx.send(res);
                    break;
                }
                Poll::Pending => thread::park(),
            }
        }
    });
    rx
}
```

这时，我们再编写一个同时启动两个任务的应用程序：

```rust
fn main() {
    println!("Start {}", chrono::Utc::now());
    let r1 = spawn(MyFuture {
        id: 1,
        start: Instant::now(),
        duration: Duration::from_secs(10),
    });
    let r2 = spawn(MyFuture {
        id: 2,
        start: Instant::now(),
        duration: Duration::from_secs(10),
    });
    let h1 = thread::spawn(move || {
        r1.recv().unwrap();
        println!("Finish 1 {}", chrono::Utc::now());
    });
    let h2 = thread::spawn(move || {
        r2.recv().unwrap();
        println!("Finish 2 {}", chrono::Utc::now());
    });
    h1.join().unwrap();
    h2.join().unwrap();
}
```

可以看到以下输出：

```text
Start 2023-11-05 10:46:31.880514 UTC
Polling 1 2023-11-05 10:46:31.880631 UTC
Polling 2 2023-11-05 10:46:31.880650 UTC
Pending 1 2023-11-05 10:46:31.880659 UTC
Pending 2 2023-11-05 10:46:31.880672 UTC
Wake up 2 2023-11-05 10:46:41.881091 UTC
Wake up 1 2023-11-05 10:46:41.881091 UTC
Polling 2 2023-11-05 10:46:41.881206 UTC
Ready 2 2023-11-05 10:46:41.881232 UTC
Polling 1 2023-11-05 10:46:41.881261 UTC
Ready 1 2023-11-05 10:46:41.881276 UTC
Finish 2 2023-11-05 10:46:41.881330 UTC
Finish 1 2023-11-05 10:46:41.881377 UTC
```

这样，我们就实现了一个最简单的 thread per task 并发模型。

## Send + 'static

上面 thread per task 的例子里，spawn 函数里多了 `Send` 或 `'static` 约束，这是因为我们在不同线程间传递 Future 实例，同时可能在线程间传递 Future 计算的结果。

这并不是 Rust Async Runtime 自身约束。如前所述，如果 Future 在当前线程构造，随后使用 block_on 在当前线程阻塞等待，Future 没有跨线程传递过，也就不需要满足 Send 约束。同样，异步运行时在能够保证计算一定不会跨线程进行时，异步计算的代码块即 Future 也不必满足 Send 约束。

在 tokio 的实现里，这种同一线程的计算是用 LocalSet 来抽象的：

```rust
let runtime = tokio::runtime::Runtime::new().unwrap();
runtime.block_on(async {
    let local = tokio::task::LocalSet::new();
    let rc = Rc::new(42);
    local.run_until(async move {
        println!("rc={rc}");
    }).await;
});
```

如果把 `local.run_until` 换成 `tokio::spawn` 那么 Rust 编译器就会抱怨被 move 进去的 Rc 实例不是 Send 的。

LocalSet 的底层实现是持有一个 LocalState 实例，其中指示了持有该 LocalSet 的线程的 ThreadId 是什么。tokio 运行时调度过程里，如果拿出来的作业对应的 ThreadId 跟当前 ThreadId 不同，则不执行该作业，而是放回 LocalSet 的任务队列里。

[glommio](https://docs.rs/glommio/) 是一个 thread per code 的异步运行时，它只提供对应到单个线程的 LocalExecutorBuilder 构造器：

```rust
let handle = LocalExecutorBuilder::default().spawn(|| async move { ... })?;
```

虽然顶层 async 块内部，可以使用 `executor().create_task_queue(...)` 创建任务队列，再调用 `glommio::spawn_local_into(fut, tq)` 把任务提交到任务队列内并发调度，但是同一个 spawn 内的所有任务，都将在同一个线程内执行。因此，所有 spawn 到 glommio 调度器上的 Future 都不必是 Send 的。

上述 LocalExecutorBuilder 的 spawn 方法最终会调用以下代码：

```rust
pub fn spawn<G, F, T>(self, fut_gen: G) -> ...
where
    G: FnOnce() -> F + Send + 'static,
    F: Future<Output = T> + 'static,
    T: Send + 'static,
{
    std::thread::Builder::new()
        .spawn(move || {
            let mut le = LocalExecutor::new(...);
            le.init();
            le.run(async move { Ok(fut_gen().await) })
        })
}
```

其中 LocalExecutor 的 run 方法定义如下：

```rust
pub fn run<T>(&self, future: impl Future<Output = T>) -> T { ... }
```

可以看到，这跟其他运行时的 block_on 函数非常相似。实际上，它们确实都是在当前线程里不停 Poll 来驱动异步计算进行。

## RawTask

block_on 函数驱动的运行时，提交上来的 Future 实例以 local 变量的方式存储在当前线程的栈上，我们在当前线程里循环阻塞的 poll 这个 Future 实例。这种情况下，我们没有把 Future 提交到什么任务队列中，也就不需要额外的存储逻辑。

上面介绍的 thread per task 运行时只是把 block_on 放到多个 thread 里，每个 thread 拿住唯一的 Future 实例不停地 poll 获取结果。可以说，thread per task 运行时针对每个 task spawn 出来的线程的栈，就是存储该 Future 实例的地方。

但是，对于 tokio 这样有任务队列的运行时来说，情况就有所不同。这时调度器需要考虑如何存储未执行或执行后返回 Pending 的作业，以等待空闲线程取出执行。

实际上，tokio 仿照标准库用 RawWaker 封装 Waker 的方法，设计了一个 RawTask 结构用以存储待执行的 Future 实例：

```rust
#[derive(Clone)]
pub(crate) struct RawTask {
    ptr: NonNull<Header>,
}

#[repr(C)]
pub(crate) struct Header {
    pub(super) state: State,
    pub(super) queue_next: UnsafeCell<Option<NonNull<Header>>>,
    pub(super) vtable: &'static Vtable,
    pub(super) owner_id: UnsafeCell<Option<NonZeroU64>>,
}

pub(super) struct Vtable {
    pub(super) poll: unsafe fn(NonNull<Header>),
    pub(super) schedule: unsafe fn(NonNull<Header>),
    pub(super) dealloc: unsafe fn(NonNull<Header>),
    pub(super) try_read_output: unsafe fn(NonNull<Header>, *mut (), &Waker),
    pub(super) drop_join_handle_slow: unsafe fn(NonNull<Header>),
    pub(super) drop_abort_handle: unsafe fn(NonNull<Header>),
    pub(super) shutdown: unsafe fn(NonNull<Header>),
    pub(super) trailer_offset: usize,
    pub(super) scheduler_offset: usize,
    pub(super) id_offset: usize,
}
```

在 tokio multi-thread 运行时的 spawn 方法调用时，底层会依次调用方法构造 RawTask 实例：

* `src/runtime/scheduler/multi_thread/handle.rs/Handle::spawn`
* `src/runtime/scheduler/multi_thread/handle.rs/Handle::bind_new_task`
* `src/runtime/task/list.rs/OwnedTasks::bind`
* `src/runtime/task/mod.rs/new_task`

```rust
// task::new_task
let raw = RawTask::new::<T, S>(fut, scheduler, id);

// RawTask::new
let ptr = Box::into_raw(Cell::<_, S>::new(fut, scheduler, State::new(), id));
let ptr = unsafe { NonNull::new_unchecked(ptr as *mut Header) };
RawTask { ptr }

// Cell::new
let vtable = raw::vtable::<T, S>();
let ptr = Box::new(Cell {
    header: new_header(
        state,
        vtable,
    ),
    core: Core {
        scheduler,
        stage: CoreStage {
            stage: UnsafeCell::new(Stage::Running(fut)),
        },
        task_id,
    },
    trailer: Trailer::new(),
});
```

概括地说，就是把 Future 计算作业和调度器 scheduler 都塞到 state 里，存一个 `void*` 指针指向到这一整坨内容，连同取回这个状态时可以如何 poll/schedule 的 VTable 也在里面。

最后，这个 RawTask 被塞到任务队列里等待被取出后 poll 运行：

```rust
// OwnedTasks::bind
lock.list.push_front(task);
```

其他运行时，包括 [smol](https://docs.rs/smol) 和 [yatp](https://github.com/tikv/yatp) 乃至以上的 glommio 在向 local 任务队列 spawn 作业时，都有类似的逻辑。在相应代码库里搜索 `RawTask` 结构就可以了解相应的逻辑。

## Future 执行

如果你分别用过 tokio 的 multi-thread 运行时和 current-thread 运行时，你就会发现前者 spawn 作业后，不用 block_on 以某种形式被调用就会自动运行，而后者 spawn 出来的作业，如果你不用 block_on 驱动，那么作业永远也不会执行。

这是因为，单纯的 spawn 部分只完成了把 RawTask 塞入到任务队列中的动作，从任务队列中取出任务执行还需要另一端逻辑来完成。

显式的 block_on 肯定是一种办法，而 tokio 的 multi-thread 运行时之所以能够“自动”运行，是因为它启动了一个多线程的线程池，线程池里的线程默认的工作就是不断从任务队列里取出待运行作业执行。

其中，`Launch::launch` 是初始化代码的关键节点。它会逐步调用到 `Spawner::spawn_task` 和 `Spawner::spawn_thread` 方法，最终启动一个新线程执行 `move || run(worker)` 闭包的逻辑。

`run` 函数在新线程里开始执行后，会逐步执行到一个 `while !core.is_shutdown` 的循环。这个循环的工作就是在 Runtime 被 shutdown 前不断获取任务队列中的作业驱动运行。

## RawTask 重新调度

再次以 tokio 为例，如果第一次 poll Future 返回 Pending 结果，那么 Future 需要保存传入 poll 的 Context 实例，从而在可以继续运行作业时将 RawTask 再次提交到调度器上。

前面我们写到 RawTask 的 VTable 里有 poll 和 schedule 方法，这两个方法就是为了这个目的设计的。

其中，RawTask 的 poll 是由上一节提到的 `run` 函数驱动的：

* `src/runtime/scheduler/multi_thread/worker.rs/run`
* `src/runtime/scheduler/multi_thread/worker.rs/Context::run`
* `src/runtime/scheduler/multi_thread/worker.rs/Context::run_task`
* `src/runtime/task/mod.rs/LocalNotified::run`

```rust
// LocalNotified::run
let raw: RawTask = self.task.raw;
raw.poll();

// Harness::poll
self.poll_inner()

// Harness::poll_inner
let header_ptr = self.header_ptr();
let waker_ref = waker_ref::<S>(&header_ptr);
let cx = Context::from_waker(&waker_ref);
let res = poll_future(self.core(), cx);
``` 

`raw.poll` 调用的是 VTable 里的 poll 函数指针，实际就是 `Harness::poll` 方法。该方法从 RawTask 的 Header 里构造出 Context 并以此为参数调用 Future 的 poll 方法。这个 Context 当中的 Waker 实现是：

```rust
unsafe fn wake_by_ref(ptr: *const ()) {
    let ptr = NonNull::new_unchecked(ptr as *mut Header);
    let raw = RawTask::from_raw(ptr);
    raw.wake_by_ref();
}

// RawTask::wake_by_ref
pub(super) fn wake_by_ref(&self) {
    self.schedule();
}
```

即将当前 RawTask 重新提交到调度器的任务队列上。

## Async IO

上面几节基本把 Rust Async Runtime 设计当中调度器部分的逻辑介绍完了。但是在这些讨论中缺少一个关键的角色，即真正把被调度作业挂起的行为。

在 Simplest Runtime 的案例里，我们简单的用 thread 的 park 方法把当前线程挂起，并在另一个线程上调用 unpark 恢复线程执行，这只是为了演示作业挂起和取回的过程。现实世界里，真正需要挂起计算的通常是两种情况：

1. 资源暂时不可用，典型的是 IO 操作需要等待。
2. 定时器逻辑尚未到达触发时间点。

其中 Async IO 是异步并发实际产生性能提升的的情况。无怪乎 Rust 的 Async 工作组成立的目的就是“关注 Async IO 的设计和实现”。

> This working group is focused around implementation/design of the "foundations" for Async I/O.

本节以 smol 运行时的 async-io 子模块为例，介绍 Async IO 的挂起和唤醒逻辑。值得注意的是，Async IO 并不是每个运行时都必须实现的内容，例如 smol 的 async-executor 和 tikv 的 yatp 都可以调度 Future 计算，但是它们本身并不提供 Async IO 的支持。

不过，如果在此基础上，把 async-io 库的 Async IO 结构跟这两个运行时结合起来，在传给运行时 spawn 的 async 块中使用 async-io 的结构并调用 `.await` 读写数据，实际上就能实现 Async IO 的能力。但是 tokio 的 Async IO 实现上并不支持这种结合，我们稍后会讨论其原因。

async-io 库的代码非常简单，它的异步运行时核心是 `Reactor` 结构。这个名字对于熟悉 Netty 等网络库的读者应该不陌生，中文通常翻译成“反应堆”。async-io 的反应堆保存了所有等待 IO 回应的任务：

```rust
pub(crate) struct Reactor {
    pub(crate) poller: Poller,
    /// Registered sources.
    sources: Mutex<Slab<Arc<Source>>>,
    events: Mutex<Events>,
}

/// A registered source of I/O events.
pub(crate) struct Source {
    /// This source's registration into the reactor.
    registration: Registration,
    /// The key of this source obtained during registration.
    key: usize,
    /// Inner state with registered wakers.
    state: Mutex<[Direction; 2]>,
}

pub enum Registration {
    Fd(RawFd),
    Signal(Signal),
    Process(Child),
}

/// A read or write direction.
struct Direction {
    waker: Option<Waker>,
    wakers: Slab<Option<Waker>>,
}

impl Direction {
    fn drain_into(&mut self, dst: &mut Vec<Waker>) {
        if let Some(w) = self.waker.take() {
            dst.push(w);
        }
        for (_, opt) in self.wakers.iter_mut() {
            if let Some(w) = opt.take() {
                dst.push(w);
            }
        }
    }
}
```

然后，一旦你使用了 async-io 库，它就会全局启动一个 "async-io" 线程，不断地遍历反应堆，处理其上等待 IO 事件的任务：

```rust
pub(crate) fn init() {
    let _ = unparker();
}

fn unparker() -> &'static parking::Unparker {
    thread::Builder::new()
        .name("async-io".to_string())
        .spawn(move || main_loop(parker))
        .expect("cannot spawn async-io thread");
}

fn main_loop(parker: parking::Parker) {
    loop {
        reactor_lock.react(None).ok();
    }
}

impl ReactorLock<'_> {
    pub(crate) fn react(&mut self, timeout: Option<Duration>) -> io::Result<()> {
        let mut wakers = Vec::new();
        self.events.clear();
        let res = match self.reactor.poller.wait(&mut self.events, timeout) {
            Ok(_) => {
                let sources = self.reactor.sources.lock().unwrap();
                for ev in self.events.iter() {
                    if let Some(source) = sources.get(ev.key) {
                        let mut state = source.state.lock().unwrap();
                        for &(dir, emitted) in &[(WRITE, ev.writable), (READ, ev.readable)] {
                            if emitted {
                                state[dir].tick = tick;
                                state[dir].drain_into(&mut wakers);
                            }
                        }
                    }
                }
            }
        }
        for waker in wakers {
            panic::catch_unwind(|| waker.wake()).ok();
        }
        res
    }
}
```

只要有等待 IO 事件的任务加入到了 `reactor.sources` 上，出现 IO 事件时，其 Waker 就会被唤醒。

至于 IO 任务的挂起，则是在 `poll_read` 遇见 `WouldBlock` 错误时，调用 `poll_readable` 方法，注册在当前的 source 上。而当前 IO 的 source 则是在创建时就已经注册在 Reactor 的 sources 集合里：

```rust
// Async<T>
pub fn new_nonblocking(io: T) -> io::Result<Async<T>> {
    let registration = unsafe { Registration::new(io.as_fd()) };
    Ok(Async {
        source: Reactor::get().insert_io(registration)?,
        io: Some(io),
    })
}

// Source
fn poll_ready(&self, dir: usize, cx: &mut Context<'_>) -> Poll<io::Result<()>> {
    state[dir].waker = Some(cx.waker().clone());
}
```

顺带一提，async-io 库也定义了一个 `block_on` 函数，且这就是 smol 运行时实际用到 block_on 函数。它的实现同样是用 thread park 和 unpark 阻塞当前线程，并把 unpark 闭包作为 Context Waker 传到 poll 方法里。

接下来简单说明 tokio Async IO 的实现，以及为什么它不能直接和其他运行时结合使用。

tokio 的 Async IO 跟 async-io 的设计有两个关键不同：

第一，不同于 async-io 把 Waker 存在反应堆上，tokio 定义了一个 ScheduledIo 结构：

```rust
pub(crate) struct ScheduledIo {
    pub(super) linked_list_pointers: UnsafeCell<linked_list::Pointers<Self>>,
    readiness: AtomicUsize,
    waiters: Mutex<Waiters>,
}

type WaitList = LinkedList<Waiter, <Waiter as linked_list::Link>::Target>;
#[derive(Debug, Default)]
struct Waiters {
    /// List of all current waiters.
    list: WaitList,
    /// Waker used for AsyncRead.
    reader: Option<Waker>,
    /// Waker used for AsyncWrite.
    writer: Option<Waker>,
}
```

第二，它把这个 ScheduledIO 结构，仿照 RawTask 的方法，只存一个指针，且这个指针是以 u64 的形式作为 mio 中 IO 事件的 Poller 需要的 token 注册的：

```rust
pub(crate) fn token(&self) -> mio::Token {
    mio::Token(self as *const _ as usize)
}

pub(super) fn add_source(...) -> io::Result<Arc<ScheduledIo>> {
    let scheduled_io = self.registrations.allocate(&mut self.synced.lock())?;
    let token = scheduled_io.token();
    self.registry.register(source, token, interest.to_mio())?;
    Ok(scheduled_io)
}
```

这个指针在事件循环驱动时被强转回来：

```rust
fn turn(...) {
    let events = &mut self.events;
    self.poll.poll(events, max_wait);
    for event in events.iter() {
        let token = event.token();
        let ready = Ready::from_mio(event);
        let ptr: *const ScheduledIo = token.0 as *const _;
        let io: &ScheduledIo = unsafe { &*ptr };
        io.set_readiness(Tick::Set(self.tick), |curr| curr | ready);
        io.wake(ready);
    }
}
```

此外，不同于 async-io 会启动一个 "async-io" 线程拉取 IO 事件，tokio 的 Async IO 使用的 ScheduledIO 依赖于 tokio Runtime 当中的调度器。且 IO Driver 的主逻辑 turn 函数依赖 tokio 的 `Launch::launch` 或 `block_on` 调用 IO Driver 的 `park` 系列方法驱动。这就是 tokio 提供的 IO 原语无法应用于其他异步运行时的原因。

相反，类似 `tokio::sync::mpsc` 这样只是使用传入的 Context 而不依赖 tokio Runtime 制造 Context 的库，就可以在其他运行时里正常使用。

## Timer

最后，快速介绍 Async 运行时里 Timer 的实现。理解了 Async IO 的实现，Timer 的实现就非常自然。

同样，Timer 被创建时会被存在某个地方。async-io 实际上也支持 Timer 接口，创造出来的 Timer 同样被存在 Reactor 上。对于 tokio 运行时，则是构造一个 TimerShared 结构存到 Wheel 里。

对于 async-io 来说，驱动的逻辑是在每次反应堆的 react 接口被调用时，调用 `process_timers` 方法把已到时间的 Timer 的 Waker 加入到待处理 Waker 集合中。除了 IO 事件发生可以触发 react 调用，如果 "async-io" 线程发现还有注册的 Timer 待触发，那么它会在最近一个 Timer 触发的时间中断阻塞等待 IO 事件，强行再次处理一次 Timer 集合：

```rust
pub(crate) fn react(&mut self, timeout: Option<Duration>) -> io::Result<()> {
    let next_timer = self.reactor.process_timers(&mut wakers);
    let timeout = match (next_timer, timeout) {
        (None, None) => None,
        (Some(t), None) | (None, Some(t)) => Some(t),
        (Some(a), Some(b)) => Some(a.min(b)),
    };
    let res = match self.reactor.poller.wait(&mut self.events, timeout) { ... }
}
```

这样，只要有 Timer 待触发，那么它一定会在预计时间点后的某个时间被唤醒，而不会永远等待。

对于 tokio 的情形，情况要稍微复杂一些。以 Sleep 为例，构造 Sleep 时会尝试从 tokio Runtime 当前的 Context 里取得调度器：

```rust
pub(crate) fn new_timeout(...) -> Sleep {
    let handle = scheduler::Handle::current();
    let entry = TimerEntry::new(&handle, deadline);
    let inner = Inner {};
    Sleep { inner, entry }
}
```

这里的 TimeEntry 对应到 Async IO 里的 ScheduledIO 结构。需要挂起任务时，调用 `self.driver().reregister(...)` 方法注册到 Timer 的 Wheel 里。跟 Async IO 依赖 `Launch::launch` 或 `block_on` 调用 IO Driver 的 `park` 方法驱动一样，Timer Wheel 也有一个 Driver 会在 IO Driver `park` 前被调用。

具体细节不再展开，可以按照这里提到的代码块和接口自行查找阅读理解。唯一值得一提的是，通常 Timer 的存储是用优先级队列或者叫小顶堆来构造，这样从数据结构里取出来的第一个 Timer 就是应当最早被触发的那一个。

## 结语

以上就是 Rust Async Runtime 实现的核心内容。概括地说，Async Runtime 包括两个核心角色，加上串联这两个角色的媒介：

第一个核心角色是调度器，即 tokio 里的 `Runtime` 或 glommio 的 `LocalExecutor` 等。它负责取得注册到调度器上的 Future 并调用 poll 方法触发计算。注册的方法通常是 `block_on` 函数或 `spawn` 方法，如果支持后者，则需要额外设计某种存储 RawTask 的结构。

第二个核心角色是驱动器，即 Async IO 的 Driver 或 Timer 的 Driver 等，也可以对应到 async-io 库的 "async-io" 线程。它负责监听外界信息（资源是否可用，时间过去多久等），并在外界信息显示被挂起的任务可以继续运行时，恢复任务运行。

驱动器和调度器沟通的媒介，就是经由 poll 接口传递的 Context 及其中的 Waker 实例。调度器构造出 Waker 实例，驱动器存储 Waker 并在任务可以继续执行时，调用 Waker 的 wake 方法恢复任务运行。恢复运行的常见实现，要么是解除 `block_on` 线程的阻塞，重新 poll 一遍，要么是把任务以 RawTask 的形式提交到调度器里，等待调度器取出作业运行。

需要说明的是，本文介绍的所有概念和实现方式，只有 Future API 和 Waker API 是标准库里的接口。其他设计和实现都是目前 Rust 社群探索出来的实践，并不是实现异步运行时的要求。

实际上，上面这些实现里至少介绍了几种不同的异步运行时风格：

* block_on vs. spawn
* thread per task vs. RawTask + TaskQueue
* Async IO 和 Timer 的多种实现形式

通往罗马的路不止一条。

最后，关于并发编程的实践，我想分享以下几点：

1. 尽量写串行代码。并发不是银弹，实际上它会增加代码复杂性。我们聊了这么多只是为了应对固有复杂性。现实编程当中，能不写就不写。
2. Timer 必须并发，IO 几乎必须并发，独立的 Worker 需要并发跑主循环。这种情况下，绑专门的线程（池）运行并发逻辑；也就是说，不要 `#[tokio::main]` 全局都在同一个大池子里竞争。这个时候，不同线程组之间，必要时用 channel 传递状态。
3. 并行计算的情形，用自动并行库（rayon）并原地等待。

## 参考阅读

* [Asynchronous Programming in Rust](https://rust-lang.github.io/async-book/)
* [Why async Rust?](https://without.boats/blog/why-async-rust/)
* [The Waker API I: what does a waker do?](https://boats.gitlab.io/blog/post/wakers-i/)
* [The Waker API II: waking across threads](https://boats.gitlab.io/blog/post/wakers-ii/)
* [Local Async Executors and Why They Should be the Default](https://maciej.codes/2022-06-09-local-async.html)
* [Thread-per-core](https://without.boats/blog/thread-per-core/)

## Bonus: async/await

上面讨论中省略了 Async Rust 的一个重要组成部分，那就是 `async` 和 `await` 语法糖到底是怎么展开的。解释这个问题涉及到 Rust 编译器解语法糖的细节，这里展开讨论内容就实在太长了，而且 Rust 编译器本身的实现一直在改。

大致上，async 块会被展开成一个接受 Context 参数的闭包，回想 Future trait 唯一定义的 poll 方法也接受一个 Context 参数，async 块转成 Future 实例的过程应该不难想象。

await 的展开比较复杂，当前实现里，它会被展开成一段带 `yield` 的 Coroutine 代码，这是一个能保存当前运行状态的结构。例如，`async { foo().await }` 大概会被展开成：

```rust
match ::std::future::IntoFuture::into_future(foo()) {
    mut __awaitee => loop {
        match unsafe { ::std::future::Future::poll(
            <::std::pin::Pin>::new_unchecked(&mut __awaitee),
            ::std::future::get_context(task_context),
        )} {
            ::std::task::Poll::Ready(result) => break result,
            ::std::task::Poll::Pending => {}
        }
        task_context = yield ();
    }
}
```

这些实现都还不是 stable 的，相关资料如下，想了解的读者可以进一步琢磨。

* [lowering async await in rust](https://wiki.cont.run/lowering-async-await-in-rust/)
* [generators](https://doc.rust-lang.org/beta/unstable-book/language-features/generators.html)
* [Coroutine](https://doc.rust-lang.org/nightly/std/ops/trait.Coroutine.html)
* [Generalized coroutines](https://lang-team.rust-lang.org/design_notes/general_coroutines.html)
* [experimental coroutines](https://rust-lang.github.io/rfcs/2033-experimental-coroutines.html)
* [desugar await](https://github.com/rust-lang/rust/blob/fee5518cdd4435c60a57fe3bb734fc1a14abeb7a/compiler/rustc_ast_lowering/src/expr.rs#L756-L770)
* [transform_async_context](https://github.com/rust-lang/rust/blob/fee5518cdd4435c60a57fe3bb734fc1a14abeb7a/compiler/rustc_mir_transform/src/coroutine.rs#L522-L542)
