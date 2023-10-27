# Meta

meta 定义了一个 Api 的元数据。通常用于与 [Middleware](/docs/middleware.md) 配合。

## 编写

meta 的类型定义位于 `/src/meta.ts` 中，你可以像下面这样，自由扩展它。

假设我们要编写一个功能，此功能允许 Api 自行定义，只有哪些 HTTP 方法可以被允许调用自己。我们可以这样编写 meta 类型：

```ts
// file: /src/meta.ts
export type Meta = {
  allowMethods: Array<"GET" | "POST" | "PUT" | "DELETE">;
};
```

编写一个 Api，使其只允许 POST 方法：

```ts
// file: /src/app/your-example/api.ts
import { defineApi } from "southern-aurora-bao";

export const test = defineApi({
  meta: {
    allowMethods: ["POST"]
  },
  action(
    params: {
      name: string;
    },
    context
  ) {
    return `hello ${params.name}`;
  }
});
```

编写一个 Middleware，使其在请求到达 Api 之前，检查请求方法是否被允许：

```ts
// file: /src/bootstrap/middleware-allow-methods.ts

import { defineFail, useMeta, useMiddleware } from "southern-aurora-bao";

export default function () {
  const middleware = useMiddleware(0);

  middleware.onAfterHTTPRequest(async (headers, detail) => {
    const meta = await useMeta(detail.path);
    const allowMethods: Array<string> = meta.allowMethods;

    if (!allowMethods.includes(detail.request.method)) {
      throw defineFail("not-allow-method", undefined);
    }
  });
}
```