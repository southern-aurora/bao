# Fail

失败通常有两种，一种是意料外的错误导致的失败，比如网络错误、堆栈溢出等，另一种是业务上的失败，例如用户不存在、订单已支付等。

在 Bao 中，对于业务失败的情形下，应该通过主动抛出异常来中断本次请求，而不是通过在结果中，返回 `null` 来完成。

例如，数据不存在，我们可以主动抛出异常的方式，通过下面代码来向客户端响应失败：

```ts
throw defineFail("not-found", undefined);
```

这样，对于调用者，将得到这样的响应：

```json
{
  "success": false,
  "fail": {
    "code": "not-found",
    "message": "Not Found",
    "data": null
  }
}
```

这样，调用者可以简单的通过 `code.success` 来得知本次请求是否成功，并通过 `fail.code` 来判断失败类型。

## Fail Code

在 `/src/fail-code` 中，定义了所有可选的失败码。

其中的键是失败码，值是一个方法，方法需要返回一个字符串，来表明详细的失败原因。参数只能有一个，可以在调用 `defineFail` 时，通过传入的参数来改变最终向客户端响应的消息信息。

```ts
// file: /src/fail-code.ts

import type { FrameworkEnums } from "southern-aurora-bao";

export const failCode = {
  "network-error": () => "Network Error",
  "internal-server-error": () => "Internal Server Error",
  "not-found": () => "Not Found",
  "not-allow-method": () => "Not Allow Method",
  "general-type-safe-error": (p: { path: string; expected: string; value: string }) => `Parameter Error: The current value is '${p.value}', which does not meet '${p.expected}' requirements`,
  "business-fail": (message: string) => `${message}`
  // You can add your own mistakes here
  // ...
} satisfies FrameworkEnums;
```