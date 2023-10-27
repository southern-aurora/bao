# Logger

日志对应用后期的问题排查非常重要，虽然可以使用 `console.log` 打印日志，但我们可能会有更多的日志需求，比如，我们想要将日志保存到文件中，或者我们想要将日志发送到云服务商的日志系统中。为了解除耦合，Bao 提供了一个日志记录器。

## 编写

我们约定俗成不使用 `console` 来打印日志，而是使用 `logger`。

```ts
import { logger } from "/src/logger";

logger.log("hello world");
```

我们实际调用的是位于 `/src/logger.ts` 中的 `logger`。默认情况下，`logger` 是一个 `console` 对象，你可以自定义它。

```ts
import type { Logger } from "southern-aurora-bao";

// By default, log output to the console
// You can customize an object to implement the log output to the file, or send it to the private log center
export const logger: Logger = console;
```

只要编写一个符合 `Logger` 类型的对象即可：

```ts
type Logger = {
  debug: (...args: Array<unknown>) => void;
  log: (...args: Array<unknown>) => void;
  warn: (...args: Array<unknown>) => void;
  error: (...args: Array<unknown>) => void;
};
```