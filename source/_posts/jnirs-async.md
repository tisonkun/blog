---
title: Rust 与 Java 程序的异步接口互操作
date: 2023-07-30
tags:
    - Rust
    - Java
    - 异步编程
categories:
    - 天工开物
---

许多语言的高性能程序库都是建立在 C/C++ 的核心实现上的。

例如，著名 Python 科学计算库 Pandas 和 Numpy 的核心是 C++ 实现的，RocksDB 的 Java 接口是对底层 C++ 接口的封装。

Rust 语言的基本目标之一就是替代 C++ 在这些领域的位置，为开发者提供 Rust 具备的安全性和可组合性优势。

[Apache OpenDAL (incubating)](https://opendal.apache.org/) 是 Databend 工程师 Xuanwo 开发的一个 Rust 语言实现的开放数据访问层。它的核心设计支持通过相同的对象存储 API 访问不同的存储服务（Service），并提供可扩展的中间件（Layer）来支持通用的请求重试、限流和指标上报功能。目前，包括 Databend / RisingWave / GreptimeDB / mozilla sccache 在内的多个软件都选用 OpenDAL 作为其存储访问接口。

{% asset_img opendal-arch.png OpenDAL 架构概念图 %}

在 Rust 核心实现的基础上，OpenDAL 提供了 Java / Python / Node.js 等不同语言的 API 绑定（Binding），以支持更广泛的生态利用 OpenDAL 已经完成的工作。例如，使用 Python 绑定，诸多大模型应用库能够在不同云厂商的对象存储服务间无缝迁移，支持用户使用任意对象存储服务。而在开发期间，则可以用内存或文件实现来模拟测试相同 API 的语义。

要在 OpenDAL 实现一个特定语言的 API 绑定，涉及到功能实现、程序库打包和发布等多个环节。本文从功能实现的角度出发，以 Java 绑定为例，讨论 OpenDAL 如何在社群力量的支持下实现 opendal-java 库。同时，重点剖析行内首个完整的 Java ↔ Rust 异步接口互操作的最佳实践。

<!-- more -->

## 跨语言互操作的基本知识

我的本科毕业论文《多计算机语⾔原理及实现机制分析之初探》当中讨论了三种跨语言互操作的方法：外部函数接口（FFI）、进程间通信（IPC）和多语言运行时。

最常见的是基于 FFI 的方案，即通过一套语言无关的函数调用约定，完成不同语言之间的通信。例如，opendal-java 就是使用 Java 的 FFI 方案 [JNI](https://docs.oracle.com/en/java/javase/17/docs/specs/jni/index.html) 来完成 Java 和 Rust 之间的互操作的。CPython、Ruby 和 Haskell 等语言实现，则是通过 libffi 来完成和 Native 函数的互操作。

可以看到，FFI 方案基本都是实现了本语言与 Native 函数即遵循 C ABI 的函数之间的互操作，要想使用这样的方案实现 Java 程序调用 CPython 函数是不可能的。这不仅仅是没有人为 Java 和 CPython 之间定义一套调用规则的原因，还有只有 Native 函数才不需要运行时的缘故。要想调用一个 Java 函数，或是一个 CPython 函数，都必须先启动一个对应语言的运行时（JRE 或 CPython 解释器）。如果每次调用都启动一个新的运行时实例，那么这个性能损耗将彻底疯狂，而如果常驻一个目标运行时的进程实例，那么更加成熟的解决方案是进程间通信。

说进程间通信或 IPC 可能还有很多人不知道是什么，举一个例子就很容易理解了：Protobuf + gRPC 的解决方案就是典型的 IPC 方案。

如果说 FFI 是定义了一套语言无关的 Native 函数调用约定，那么 IPC 就是定义了一套语言无关进程接口调用约定。在 gRPC 之外，Apache Thrift / Apache Avro RPC / Apache Arrow Flight RPC 也都定义了各自的语言无关的进程接口调用约定，一般称为接口描述语言（IDL）。

这种方式下，开发者需要首先使用 IDL 定义好想要进行互操作的接口，随后使用对应方案的编译器产生调用方或被调用方语言的数据结构定义和接口存根（stub）对象，接着实现接口逻辑并在进程启动时暴露访问端口。实际调用时，调用方将接口访问及其参数结构编码为字节流，发送到接收方端口，接收方解码请求及其参数，完成请求后回传编码后的结果。

显而易见，IPC 的方式比起 FFI 的方式多了大约两轮数据编解码，加上一个来回网络字节传输的开销。

最后一种跨语言互操作的方案是多语言运行时，这个词汇可能又很陌生。同样举一个实例：JVM 就是一个跨语言运行时。

JVM 上面首先可以运行 Java 语言。然后，它可以运行 Scala / Groovy / Kotlin 等 JVM 族的语言。到这里，JVM 已经可以实现定义上的跨语言互操作了，因为 Java 和后面几个语音确实不是同一个编程语言。进一步地，JVM 上可以运行 Clojure 语言，这意味着 JVM 支持 Java 和 Lisp 之间的互操作。当然，Lisp 比较小众，所以最后我给出百分百令人信服的例子：在 JVM 上可以用 Jython 和 JRuby 实现 Java 和 Python 或 Ruby 的互操作，甚至实现 Python 和 Ruby 的互操作。虽然 Jython 项目凉凉了，但是 JRuby 仍然有很多下游使用，例如 HBase 的 Shell 是 JRuby 实现的，ELK 软件栈中的 Logstash 也是 JRuby 实现的。

此外，在多语言运行时的理论先锋 GraalVM 和 Truffle Framework 的支持下，GraalPy / TruffleRuby / FastR / Sulong (LLVM bitcode) 等等方案接连出现并活跃发展至今。这也是我在毕业论文中重点讨论和研究的对象。

OpenDAL 的多语言 API 绑定最终选择了基于 FFI 的方案。

首先，OpenDAL 根本不启动进程，它被设计为程序直接调用的软件库，所以 IPC 方案从模型上就是不适合的，更不用说调用一个基本的数据访问 API 不应该有多余的网络开销。不过，由于 Golang 自闭的跨语言生态和极力推崇 RPC 的哲学，OpenDAL 支持 Golang 调用的方式可能真的得做一个 service 然后暴露出 RPC 接口。

而多语言运行时的方案，应该说目前还没有支持 Java 和 Rust 或 Native 函数互操作的多语言运行时方案。最接近的是 GraalVM 上的 Sulong 运行时，但是它和它所依赖的 GraalVM 都还不算成熟甚至还未大规模生产使用，且 Sulong 支持的是执行 LLVM bitcode 代码，采用这个方案，就要解决 Rust ↔ LLVM bitcode ↔ Java 三方的沟通和版本适配问题。一言以蔽之，这个方案技术上就很难实现。

## opendal-java 的实现

Java 通过 JNI 约定调用 C ABI 函数的一般实现流程如下：

1. Java 侧定义一个 `native` 方法；

```java
package org.apache.opendal;
public class BlockingOperator extends NativeObject {
    private static native long constructor(String schema, Map<String, String> map);
}
```

2. C ABI 侧定义一个符合[方法编码规则](https://docs.oracle.com/en/java/javase/17/docs/specs/jni/design.html#resolving-native-method-names)的函数，这里以 opendal-java 中的定义为例；

```rust
#[no_mangle]
pub extern "system" fn Java_org_apache_opendal_BlockingOperator_constructor(
    mut env: JNIEnv,
    _: JClass,
    scheme: JString,
    map: JObject,
) -> jlong {
    // ...
}
```

3. Java 程序启动时，调用 `System.loadLibrary(libname)` 或 `System.load(filename)` 方法加载 native 库，后续对 `native` 方法的调用便会转为在 native 库中查找经过编码后的对应 native 函数的调用。

知道了基本的方法映射模式，我们就可以分点来讨论 opendal-java 中的设计要点和技术难点了。

### Native Object

从简单的不涉及异步接口互操作的 Blocking Operator 开始。

```java
public class BlockingOperator extends NativeObject {
    // ...

    public BlockingOperator(String schema, Map<String, String> map) {
        super(constructor(schema, map));
    }

    public String read(String path) {
        return read(nativeHandle, path);
    }

    public Metadata stat(String path) {
        return new Metadata(stat(nativeHandle, path));
    }

    @Override
    protected native void disposeInternal(long handle);
    private static native long constructor(String schema, Map<String, String> map);
    private static native String read(long nativeHandle, String path);
    private static native long stat(long nativeHandle, String path);
}

public class Metadata extends NativeObject {
    // ...

    protected Metadata(long nativeHandle) {
        super(nativeHandle);
    }
}

public abstract class NativeObject implements AutoCloseable {
    // ...

    protected final long nativeHandle;

    protected NativeObject(long nativeHandle) {
        this.nativeHandle = nativeHandle;
    }

    @Override
    public void close() {
        disposeInternal(nativeHandle);
    }

    protected abstract void disposeInternal(long handle);
}
```

这个代码片段介绍了 Java 侧的主要映射策略：

1. 每个对应到 Rust 侧结构的类都继承自 `NativeObject` 类，它持有一个 `nativeHandle` 字段，指示 Rust 侧对应结构的指针。
2. 这个指针通过 `constructor` native 方法获得，通过 `disposeInternal` native 方法释放。
3. 每个方法，例如上面的 `read` 方法，在内部都会被转成 `methodName(nativeHandle, args..)` 的 native 方法调用，前面可能有一些必要的 marshalling 工作。
4. 每个返回 Rust 结构的方法，例如上面的 `stat` 方法，其 native 方法返回对应结构指针的整数，在 Java 侧方法返回前包装成继承自 `NativeObject` 的类。

`NativeObject` 包括了一段动态库加载的 static 逻辑，这是一个独立且复杂的话题，这里不做展开。

对应到 Rust 侧，native 方法实现的模板如下：

```rust
#[no_mangle]
pub extern "system" fn Java_org_apache_opendal_BlockingOperator_constructor(
    mut env: JNIEnv,
    _: JClass,
    scheme: JString,
    map: JObject,
) -> jlong {
    intern_constructor(&mut env, scheme, map).unwrap_or_else(|e| {
        e.throw(&mut env);
        0
    })
}

fn intern_constructor(env: &mut JNIEnv, scheme: JString, map: JObject) -> Result<jlong> {
    let scheme = Scheme::from_str(env.get_string(&scheme)?.to_str()?)?;
    let map = jmap_to_hashmap(env, &map)?;
    let op = Operator::via_map(scheme, map)?;
    Ok(Box::into_raw(Box::new(op.blocking())) as jlong)
}

#[no_mangle]
pub unsafe extern "system" fn Java_org_apache_opendal_BlockingOperator_disposeInternal(
    _: JNIEnv,
    _: JClass,
    op: *mut BlockingOperator,
) {
    drop(Box::from_raw(op));
}

#[no_mangle]
pub unsafe extern "system" fn Java_org_apache_opendal_BlockingOperator_read(
    mut env: JNIEnv,
    _: JClass,
    op: *mut BlockingOperator,
    path: JString,
) -> jstring {
    intern_read(&mut env, &mut *op, path).unwrap_or_else(|e| {
        e.throw(&mut env);
        JObject::null().into_raw()
    })
}

fn intern_read(env: &mut JNIEnv, op: &mut BlockingOperator, path: JString) -> Result<jstring> {
    let path = env.get_string(&path)?;
    let content = String::from_utf8(op.read(path.to_str()?)?)?;
    Ok(env.new_string(content)?.into_raw())
}

#[no_mangle]
pub unsafe extern "system" fn Java_org_apache_opendal_BlockingOperator_stat(
    mut env: JNIEnv,
    _: JClass,
    op: *mut BlockingOperator,
    path: JString,
) -> jlong {
    intern_stat(&mut env, &mut *op, path).unwrap_or_else(|e| {
        e.throw(&mut env);
        0
    })
}

fn intern_stat(env: &mut JNIEnv, op: &mut BlockingOperator, path: JString) -> Result<jlong> {
    let path = env.get_string(&path)?;
    let metadata = op.stat(path.to_str()?)?;
    Ok(Box::into_raw(Box::new(metadata)) as jlong)
}
```

这里有三个要点。

第一，虽然 Rust 的 FFI 理论上可以直接对接 JNI 的标准，但是我还是使用了 [jni-rs](https://github.com/jni-rs/jni-rs) 库来简化开发。这个库的质量很不错，其主要工作是在 FFI 接口上封装了一套 JNI 领域模型的 Rust 结构。例如 JMap 这样的结构在 JNI 里是不存在的，JString 提供的接口也非常方便。注意 String 在这个传递过程中是有可能产生 marshalling 开销的。

第二，每个 JNI 接口函数都实现为调用对应的 intern 函数，然后用一段 `unwrap_or_else(|e| {e.throw})` 的模板处理可能的错误。这是因为 JNI 的接口不能返回 `Result` 类型，所以做了一个错误处理的集中抽象。具体设计实现下一段会谈，这里主要说明的是可以最大程度的避免 `unwrap` 或对等方法的调用，把错误传递到 Java 侧用 Exception 来处理，而不是 Rust 侧 panic 即等价与 C++ core dump 来处理失败。后者显然是所有 Java 用户都不想处理的问题，也无法在 Java 侧捕捉处理。

第三，可以注意下如何返回 Rust 结构的指针，以及 `disposeInternal` 时如何释放指针。这是 Rust 内存安全的边界，理解这里面的逻辑对编写内存安全的 Rust FFI 有很大的帮助。

> 这里有一个潜在的优化点：`Metadata` 其实是个记录结构（record），如果能做好 marshalling 对应，可以直接编码返回，这样 Java 拿到的就是一个完全自己管理生命周期的数据对象，后续也不用走 JNI 去访问 Metadata 的数据。

### 错误处理

opendal-java 的一个创新价值是实现了一套 Rust ↔ Java 的错误处理范式。

在 Rust 侧，我们在 intern 系列方法里完成调用 Rust 函数的工作，回传 Result 到外层 FFI 接口处理。如果 Result 是错误结果，那么会走一个 `throw` 的过程抛出异常。这个过程会从 Rust 侧的错误提取出错误信息和错误码，然后构造 Java 侧的异常。

```rust
pub(crate) struct Error {
    inner: opendal::Error,
}

impl Error {
    pub(crate) fn throw(&self, env: &mut JNIEnv) {
        if let Err(err) = self.do_throw(env) {
            env.fatal_error(err.to_string());
        }
    }

    fn do_throw(&self, env: &mut JNIEnv) -> jni::errors::Result<()> {
        let exception = self.to_exception(env)?;
        env.throw(exception)
    }

    pub(crate) fn to_exception<'local>(
        &self,
        env: &mut JNIEnv<'local>,
    ) -> jni::errors::Result<JThrowable<'local>> {
        let class = env.find_class("org/apache/opendal/OpenDALException")?;
        let code = env.new_string(...);
        let message = env.new_string(self.inner.to_string())?;
        let exception = env.new_object(...);
        Ok(JThrowable::from(exception))
    }
}
```

对应 Java 侧 `OpenDALException` 定义如下：

```java
public class OpenDALException extends RuntimeException {
    private final Code code;
    public OpenDALException(String code, String message) {
        this(Code.valueOf(code), message);
    }
    public OpenDALException(Code code, String message) {
        super(message);
        this.code = code;
    }
    public Code getCode() {
        return code;
    }
    public enum Code {
        // ...
    }
}
```

运用这个范式，我把整个绑定 Rust 侧的 panic 调用控制在了 10 个以内，且全部是在异步接口互操作的范畴里的。其中大部分在 Load 和 Unload 的逻辑里，这是整个程序启动和终止的地方。其他的调用在 Rust 侧完成 Futrue 后回调的上下文里。这两者的共同点是：它们都对应不到一个用户控制的 Java 上下文来抛出异常。

### 异步接口互操作

opendal-java 的另一个创新价值，也是业内首创的方案，是实现了 Rust ↔ Java 异步接口互操作。

opendal-java 的第一版异步接口互操作实现是基于 Global Reference 的。但这个方案有一个缺陷，那就是 Global Reference 上限是 65535 个。所谓基于 Global Reference 的方案，就是把需要异步完成的 `CompletableFuture` 对象注册为 JNI 的 Global Reference 并跨线程共享，这意味着整个程序的 API 调用并发上限一定不超过 65535 个。

虽然这个数量对于大部分场景已经够用，但是毕竟是个无谓的开销，且 Global Reference 的访问没有经过特别的优化，很难估计重度使用这个特性会带来怎样的不稳定性。

我曾经构思过基于全局 Future Registry 的解决方案，或者演化成一个类似于跨语言 Actor Model (Dispatcher + Actor with Mailbox) 的方案，但是最终都没有成功写出来。

这里面主要的难点是 JNI 调用所必须的 `JNIEnv` 不是线程安全的。而要想真正实现 Java 调用 Rust 的异步接口，并在 Rust 异步动作完成后回调，而不是原地阻塞等待，调用过程一定会经历从 JNI 调用线程转移到 Rust 的后台异步线程。Global Reference 能够把 Java 对象提升到全局空间，进而跨线程共享，但是这其实也不解决 `JNIEnv` 不能移动到另一个线程的问题。

opendal-java 的第一版异步接口互操作实现解决了这个问题，其核心代码如下：

```rust
static mut RUNTIME: OnceCell<Runtime> = OnceCell::new();
thread_local! {
    static ENV: RefCell<Option<*mut jni::sys::JNIEnv>> = RefCell::new(None);
}

#[no_mangle]
pub unsafe extern "system" fn JNI_OnLoad(vm: JavaVM, _: *mut c_void) -> jint {
    RUNTIME
        .set(
            Builder::new_multi_thread()
                .worker_threads(num_cpus::get())
                .on_thread_start(move || {
                    ENV.with(|cell| {
                        let env = vm.attach_current_thread_as_daemon().unwrap();
                        *cell.borrow_mut() = Some(env.get_raw());
                    })
                })
                .build()
                .unwrap(),
        )
        .unwrap();

    JNI_VERSION_1_8
}

#[no_mangle]
pub unsafe extern "system" fn JNI_OnUnload(_: JavaVM, _: *mut c_void) {
    if let Some(r) = RUNTIME.take() {
        r.shutdown_background()
    }
}

unsafe fn get_current_env<'local>() -> JNIEnv<'local> {
    let env = ENV.with(|cell| *cell.borrow_mut()).unwrap();
    JNIEnv::from_raw(env).unwrap()
}

unsafe fn get_global_runtime<'local>() -> &'local Runtime {
    RUNTIME.get_unchecked()
}
```

其中，`RUNTIME` 的启动、关闭和获取是常规的使用 tokio 异步框架的方式：虽然可能更多人是简单的 `#[tokio::main]` 解决，但是其实 tokio 底下大概也是这么一个全局共享的 RUNTIME 的实现。

真正值得注意的是 `JNI_OnLoad` 传进来了一个线程安全的 `JavaVM` 对象，我们基于它在每个 tokio RUNTIME 的线程里 attach 了一个 `JNIEnv` 实例。

上面提到，`JNIEnv` 不是线程安全的，但是我们现在是在每个 tokio 线程池的线程里各自创建了一个本地的 `JNIEnv` 实例，这些实例在各自的线程里存活，并不跨线程共享。

`JNI_OnLoad` 方法就是这里破解难点的关键，它在本动态库被加载（通过 `System.load` 或者 `System.loadLibrary` 方法）之后被调用，传递当前 JavaVM 实例以供使用。由于运行当前程序的 JavaVM 全局只有一个，它是线程安全的，并且有一个 `attach_current_thread_as_daemon` 方法可以把当前线程注册到 JVM 上，获取 JNI 操作必须的 `JNIEnv` 对象。

突破这个问题以后，我们其实完全就不需要用 Global Reference 来传递 `CompletableFuture` 对象，而是可以实现我设想过的全局 Future Registry 方案了。其主要代码如下：

```java
private enum AsyncRegistry {
    INSTANCE;
    private final Map<Long, CompletableFuture<?>> registry = new ConcurrentHashMap<>();
    private static long requestId() {
        final CompletableFuture<?> f = new CompletableFuture<>();
        while (true) {
            final long requestId = Math.abs(UUID.randomUUID().getLeastSignificantBits());
            final CompletableFuture<?> prev = INSTANCE.registry.putIfAbsent(requestId, f);
            if (prev == null) {
                return requestId;
            }
        }
    }
    private static CompletableFuture<?> get(long requestId) {
        return INSTANCE.registry.get(requestId);
    }
    private static <T> CompletableFuture<T> take(long requestId) {
        final CompletableFuture<?> f = get(requestId);
        if (f != null) {
            f.whenComplete((r, e) -> INSTANCE.registry.remove(requestId));
        }
        return (CompletableFuture<T>) f;
    }
}

public class Operator extends NativeObject {
    // ...

    public CompletableFuture<Metadata> stat(String path) {
        final long requestId = stat(nativeHandle, path);
        final CompletableFuture<Long> f = AsyncRegistry.take(requestId);
        return f.thenApply(Metadata::new);
    }

    public CompletableFuture<String> read(String path) {
        final long requestId = read(nativeHandle, path);
        return AsyncRegistry.take(requestId);
    }

    private static native long stat(long nativeHandle, String path);
    private static native long read(long nativeHandle, String path);
}
```

这次，所有的 native 方法都返回一个 `long` 值，它是一个从 `AsyncRegistry` 中获取结果对应的 `CompletableFuture` 的凭证。

Rust 侧通过 JNI 调用 `AsyncRegistry#requestId` 方法注册一个 Future 并取得它的凭证，随后这个凭证（整数）被传递到 tokio RUNTIME 创建的后台线程里，完成 API 调用后，通过后台线程的 `JNIEnv` 调用 `AsyncRegistry#get` 方法取得 `CompletableFuture` 对象，调用 `CompletableFuture#complete` 方法回填结果，或者 `CompletableFuture#completeExceptionally` 方法回调异常。

其主要代码如下：

```rust
fn request_id(env: &mut JNIEnv) -> Result<jlong> {
    Ok(env
        .call_static_method(
            "org/apache/opendal/Operator$AsyncRegistry",
            "requestId",
            "()J",
            &[],
        )?
        .j()?)
}

fn get_future<'local>(env: &mut JNIEnv<'local>, id: jlong) -> Result<JObject<'local>> {
    Ok(env
        .call_static_method(
            "org/apache/opendal/Operator$AsyncRegistry",
            "get",
            "(J)Ljava/util/concurrent/CompletableFuture;",
            &[JValue::Long(id)],
        )?
        .l()?)
}

fn complete_future(id: jlong, result: Result<JValueOwned>) {
    let mut env = unsafe { get_current_env() };
    let future = get_future(&mut env, id).unwrap();
    match result {
        Ok(result) => {
            let result = make_object(&mut env, result).unwrap();
            env.call_method(
                future,
                "complete",
                "(Ljava/lang/Object;)Z",
                &[JValue::Object(&result)],
            )
            .unwrap()
        }
        Err(err) => {
            let exception = err.to_exception(&mut env).unwrap();
            env.call_method(
                future,
                "completeExceptionally",
                "(Ljava/lang/Throwable;)Z",
                &[JValue::Object(&exception)],
            )
            .unwrap()
        }
    };
}

#[no_mangle]
pub unsafe extern "system" fn Java_org_apache_opendal_Operator_read(
    mut env: JNIEnv,
    _: JClass,
    op: *mut Operator,
    path: JString,
) -> jlong {
    intern_read(&mut env, op, path).unwrap_or_else(|e| {
        e.throw(&mut env);
        0
    })
}

fn intern_read(env: &mut JNIEnv, op: *mut Operator, path: JString) -> Result<jlong> {
    let op = unsafe { &mut *op };
    let id = request_id(env)?;

    let path = env.get_string(&path)?.to_str()?.to_string();

    unsafe { get_global_runtime() }.spawn(async move {
        let result = do_read(op, path).await;
        complete_future(id, result.map(JValueOwned::Object))
    });

    Ok(id)
}

async fn do_read<'local>(op: &mut Operator, path: String) -> Result<JObject<'local>> {
    let content = op.read(&path).await?;
    let content = String::from_utf8(content)?;

    let env = unsafe { get_current_env() };
    let result = env.new_string(content)?;
    Ok(result.into())
}

fn make_object<'local>(
    env: &mut JNIEnv<'local>,
    value: JValueOwned<'local>,
) -> Result<JObject<'local>> {
    let o = match value {
        JValueOwned::Object(o) => o,
        JValueOwned::Byte(_) => env.new_object("java/lang/Long", "(B)V", &[value.borrow()])?,
        JValueOwned::Char(_) => env.new_object("java/lang/Char", "(C)V", &[value.borrow()])?,
        JValueOwned::Short(_) => env.new_object("java/lang/Short", "(S)V", &[value.borrow()])?,
        JValueOwned::Int(_) => env.new_object("java/lang/Integer", "(I)V", &[value.borrow()])?,
        JValueOwned::Long(_) => env.new_object("java/lang/Long", "(J)V", &[value.borrow()])?,
        JValueOwned::Bool(_) => env.new_object("java/lang/Boolean", "(Z)V", &[value.borrow()])?,
        JValueOwned::Float(_) => env.new_object("java/lang/Float", "(F)V", &[value.borrow()])?,
        JValueOwned::Double(_) => env.new_object("java/lang/Double", "(D)V", &[value.borrow()])?,
        JValueOwned::Void => JObject::null(),
    };
    Ok(o)
}
```

可以看到，我构建了一个实现 API 接口绑定的模式：

1. 外层 JNI 映射函数和阻塞接口一样，调用 intern 方法并串接 throw 回调，处理同步阶段可能的异常。这主要来自于 String marshalling 和参数合法性检查的步骤。
2. intern 方法处理参数映射，从 AsyncRegistry 里取得 Future 的凭证，随后调用 `unsafe { get_global_runtime() }.spawn(...)` 把 API 请求发送到后台线程处理，并返回 Futrue 凭证。Java 侧的 native 方法返回，取得凭证。
3. do 方法在后台线程执行，得到结果。该结果由 `complete_future` 方法处理回调 `CompletableFuture` 的方法回填结果或异常。

其他的细节可以读源码分析，这里再提一下对异常的处理。

可以看到，只要是在 Java 侧调用 JNI 线程里的异常，我都压在 intern 方法的 Result 里抛出去了。JNI Onload 和 Unload 过程没有用户能处理的线程，tokio RUNTIME 的后台线程调用 `complete_future` 方法的时候也不在用户能处理的线程上，所以这些地方我都用了 `unwrap` 来处理错误。一方面是用户根本处理不了，另一方面也是这些调用是可以确保一定成功的，如果不成功，一定是代码写错了或者底层的不变式被破坏了，即使用户可以捕获这些异常，也不可能有合理的处理方式。

当然，如果未来发现其中某些异常可以恢复，可以在 Rust 侧从错误里恢复。技术上，do 方法返回的 err 会被 `complete_future` 回传到 `CompletableFuture` 的错误结果里，这也是一种不 panic 的 tokio RUNTIME 中的错误处理方式。

## 社群驱动的开发方式

虽然当前版本的 opendal-java 主要是我的设计，但是它的第一版并不是我写的。

项目作者 Xuanwo 首先开了 Java 绑定的 [Issue-1572](https://github.com/apache/incubator-opendal/issues/1572) 提出需求，随后 @kidylee 很快表达了兴趣。由于我此前尝试过构建基于 TiKV Rust client 的 Java client 绑定，我分享了我做过的尝试。

不过，我没能实现一个符合自己期望的 TiKV Java client 绑定，所以在我想清楚之前，我并没有动力去做一个自己不满意的实现。

但是这个时候 @kidylee 很快做出了第一版 blocking operator 的实现。一个月后，来自 RocketMQ 社群的 @ShadowySpirits 也加入了进来。他想实现异步接口的支持，而这就是我之前没想通所以不愿意动手的卡点。

@ShadowySpirits 很快做了一个基于我放弃的 Global Reference 的解决方案，虽然 Global Reference 有上面我提到过的缺陷，但是他构建的 JNI Onload 方法及其全局线程池共享的方式给了我启发，Thread loacal 共享 JNIEnv 的方案打通了我之前面临的 JNIEnv 不 Sync 的难题，我于是得以实现自己就差最后一个技术难点的基于全局 AsyncRegistry 的解决方案，彻底绕过了 Global Reference 的限制。

功能实现以后，出于没有发布的软件就得不到严肃使用的认知，我着手解决了基本的项目打包和发布逻辑问题（[Issue-2313](https://github.com/apache/incubator-opendal/issues/2313)）和发布前的其他功能、测试和文档工作（[Issue-2339](https://github.com/apache/incubator-opendal/issues/2339)）。

这些工作完成以后，opendal-java 就正式发布到 [Maven 中央资源库](https://central.sonatype.com/artifact/org.apache.opendal/opendal-java)了。

昨天 @luky116 上报的另一个[问题](https://github.com/apache/incubator-opendal/issues/2730)验证了我对软件发布重要性的认知。他凭着直觉使用 opendal-java 库，马上撞上了一个构建问题。这使得我重新思考了之前打包方式对下游用户的不方便之处，并记录了对应的 Issue 追踪。

* [Package opendal-java in one artifact with all dylibs for different arch](https://github.com/apache/incubator-opendal/issues/2731)

我的计划是复刻 rocksdbjni 的发布方法，在不同平台编译动态库，最后合并不同平台编译出来的库到 resources 目录下发布，加载逻辑对应处理好平台架构的命名和发现逻辑。这个同时要修改 `NativeObject` 里的动态库加载逻辑，Maven 的打包逻辑和 GitHub Actions 的构建和发布逻辑。如果你了解 RocksDB 的打包发布方式，可以参与进来。不过这样的人应该很少，所以如果你感兴趣，也可以订阅这个问题，等我下个月找到时间演示一下解法。

此外，我在绕过 @luky116 遇到的构建问题以后，还发现了 opendal-java 对 OpenDAL features 打包的问题，可能会影响下游用户的使用预期。这个问题是个产品问题，我也记了一个 [Issue](https://github.com/apache/incubator-opendal/issues/2732) 来讨论。基本上，用户可以自己打包动态库并指定动态库发现路径，这是最终兜底方案。但是这个方案目前没有直接的文档，只是我这个实现的人心里清楚。而且作为上游，有些 features 是适合一揽子打包出去，提供更好的开箱体验的。

最后，如果你也想体验一下开发 OpenDAL 多语言 API 绑定的过程，可以参与到我做了一半的 C# 绑定上来：

* [OpenDAL C# bindings](https://github.com/apache/incubator-opendal/issues/2428)

基本的项目框架我已经定好了，后续工作的参考材料也列出来了。如果你有足够的背景，我提供的材料应该已经足够作为直接实现的参考。

C# 绑定相较于 Java 绑定的优势在于它有原生的 C ABI repr 支持，这能减少一部分 marshalling 的开销。但是这些技术使用的人比较少，或者说整个 .NET 技术栈的用户都显著少于 JVM 技术栈，更不用说国内几乎没有 .NET 技术栈的企业，也就没有什么中文材料，所以学习新知识的门槛可能会有一些。
