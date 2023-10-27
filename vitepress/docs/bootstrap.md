# Bootstrap

Bootstrap 是一个"魔法"目录，位置在 `/src/bootstrap`。

在 Bao 启动时，所有此目录下的文件，都会被自动执行。Bao 不会尝试运行子目录中的文件。

## 编写

所有的 Bootstrap 文件都需要是一个具有默认导出的函数，它可以是异步函数。例如：

```ts
// file: /src/bootstrap/your-example-bootstrap.ts
export default async function () {
  console.log('hello world')
}
```