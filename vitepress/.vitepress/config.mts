import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  base: "/bao/",
  title: "BAO",
  description: "高性能的 Bun 框架，以人为本，像你代码中的人体工学椅",
  locales: {
    root: {
      label: "中文",
      lang: "zh"
    },
    zh: {
      label: "English",
      lang: "en",
      link: "https://github.com/akirarika/co"
    }
  },
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [],

    sidebar: [
      {
        text: "首页",
        items: [{ text: "入门", link: "/" }]
      },
      {
        text: "概述",
        items: [
          { text: "安装", link: "/docs/install" },
          { text: "生成阶段", link: "/docs/generation-phase" }
        ]
      },
      {
        text: "功能",
        items: [
          { text: "Api", link: "/docs/api" },
          { text: "Middleware", link: "/docs/middleware" },
          { text: "Bootstrap", link: "/docs/bootstrap" },
          { text: "Use", link: "/docs/use" },
          { text: "Meta", link: "/docs/meta" },
          { text: "Context", link: "/docs/context" },
          { text: "Config", link: "/docs/config" },
          { text: "FrameworkConfig", link: "/docs/framework-config" },
          { text: "Cache", link: "/docs/cache" },
          { text: "Database", link: "/docs/database" },
          { text: "Logger", link: "/docs/logger" },
          { text: "Fail", link: "/docs/fail" },
          { text: "Client", link: "/docs/client" },
          { text: "Test", link: "/docs/test" }
        ]
      },
      {
        text: "食谱",
        items: [
          { text: "Prisma", link: "/recipes/prisma" },
          { text: "MikrORM", link: "/recipes/mikro-orm" }
        ]
      }
    ]
  }
});
