# 安装

## 先决条件

### Bun

首先，你需要安装 Bun。Bun 是一个非常快的 JavaScript 运行时，而且和 NodeJs 兼容。你可以在 [这里](https://bun.sh/docs/installation) 找到安装方法。

由于 Bun 尚未拥有完整的 Windows 支持，因此，如果你使用 Windows 系统，我建议你使用 [WSL2](https://learn.microsoft.com/en-us/windows/wsl/install) 来进行开发。

你可以通过安装 Visual Studio Code 的 [WSL](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-wsl) 插件，来直接打开 WSL2 中的目录，并在 WSL2 中进行开发。

### CO

[CO](https://github.com/southern-aurora/co) 是一个命令别名工具，你可以通过它来简化命令的输入。

除此以外，CO 还可以帮助你统一包管理器的命令。也许你有一些工程还在使用 NodeJs 的 npm，或者 yarn、pnpm 甚至 deno。CO 可以帮助你统一这些命令，让你不需要再记住这些命令的区别。

对于任何工程，你都可以简单地通过运行诸如 `co i lodash` 这样的命令来安装。

对于 Bao 而言，项目的启动与运行等命令，都是通过 CO 来执行的。

## 快速开始

想要开始使用 Bao，你可以通过下载 Bao 的[模板](https://github.com/southern-aurora/bao-template)，或者直接使用 Git 来下载：

```bash
git clone https://github.com/southern-aurora/bao-template
```

进入到模板目录中，运行 `co i` 来安装依赖。结束后，可运行 `co dev` 命令来启动开发服务器。

当开发服务器启动成功后，你可以快速通过命令来访问默认生成的示例接口：

```bash
curl --location --request POST 'http://localhost:9000/hello-world/say' --header 'Content-Type: application/json' --data-raw '{"by":"bao"}'
```

你将会得到如下的响应：

```json
{
  "json":{
    "success":true,
    "data":{
      "youSay":"hello world! (by bao)"
    }
  }
}
```

刚刚访问的接口所对应的文件位于 `/src/app/hello-world/api.ts`，你可以随意编辑它。