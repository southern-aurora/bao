# Api

Api 是运行你实际业务逻辑的入口。

尽管，Api 通常运行在 HTTP 环境当中，但 Api 被设计为了尽可能通用的方式。它也可以由其他方式运行，例如，通过命令行执行、抑或是其他微服务调用、甚至由其他 JavaScript 脚本调用等。

## 编写

`/src/app` 是一个"魔法"目录，它下面的所有名为 `api.ts` 的文件，都会被自动加载。你可以在其中创建任意的目录结构，来组织你的 Api。

除了名为 `api.ts` 以外的文件都是私有的，它们不会被自动加载。你可以在 `api.ts` 中，通过 `import` 其他文件的方式来拆分组织你的代码。

```ts
import { defineApi, defineFail } from "southern-aurora-bao";

export const foo = defineApi({
  meta: {
    //
  },
  action(
    params: {
      by?: string;
    },
    context
  ) {
    const message = "hello world, by: " + params.by;

    return {
      say: message
    };
  }
});
```

## meta

`meta` 是 Api 的元数据。详情请参阅 [元数据](/docs/meta.md) 章节。

## action

`action` 是 Api 所执行的具体逻辑。它是一个函数，并接受 `data` 和 `context` 两个参数。

### params 参数

`params` 参数是此 Api 可接受的参数。当一个请求访问此 Api 时，Bao 会自动对请求的数据格式进行校验。如果校验失败，Bao 会返回 `general-type-safe-error` 的失败错误码。

你还可以利用 [Typia](https://typia.io/docs/validators/tags/#type-tags) 实现更复杂的校验。

```ts
import typia from "typia";
// ...
action(
  params: {
    id: string & typia.tags.Format<"uuid">;
    email: string & typia.tags.Format<"email">;
    age: number 
        & typia.tags.Type<"uint32"> 
        & typia.tags.ExclusiveMinimum<19> 
        & typia.tags.Maximum<100>;
  },
  context
) {
// ...
}
```

### context 参数

`context` 参数是一个对象，它包含了当前请求的上下文信息。

有关 `context` 的更多信息，请参阅 [Context](/docs/context.md) 章节。