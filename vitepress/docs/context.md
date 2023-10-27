# Context

context 是一个对象，它包含了当前请求的上下文信息。

除此以外，context 也相当于一个"全局变量"。你可以编写一个[Middleware](/docs/middleware.md)，在其中读取用户信息，并将其挂载到 `context.user` 中，而在 Api 中，直接通过 `context.user` 来获取当前用户的信息。

## 编写

context 的类型定义位于 `/src/context.ts` 中，你可以像下面这样，自由扩展它。

不过，我们要注意，你扩展了 context 的类型后，并不代表数据真的存在于 context 中。除了 context 的自带属性以外，你需要自己编写代码，来将数据挂载到 context 中。

```ts
// file: /src/context.ts
import type { FrameworkContext } from "southern-aurora-bao";

export type Context = {
  user: {
    id: string;
    name: string;
    email: string;
  };
  // ...
} & FrameworkContext;
```

## 细节

### 必要属性

在所有情况下，context 都包含以下属性：

- `context.contextId`：当前请求的唯一标识符。

- `context.headers`：当前请求的头部信息。

- `context.path`: 当前请求的路径。(不包括前缀、URL Paramters)

### 非必要属性

除此之外，还拥有 `context.detail` 属性。它是一个对象，其中，包含了可能当前所处环境中不存在的信息。

尽管，Api 通常运行在 HTTP 环境当中，但 Api 被设计为了尽可能通用的方式。它也可以由其他方式运行，例如，通过命令行执行、抑或是其他微服务调用、甚至由其他 JavaScript 脚本调用等。

例如，当 Api 在 HTTP 环境中运行时，`context.detail` 包含以下属性：

- `context.detail.request`：当前请求对象。

- `context.detail.response`：当前响应对象。

- `context.detail.ip`：当前请求的 ip 地址。

- `context.detail.fullurl`：当前请求的真实 URL 对象。