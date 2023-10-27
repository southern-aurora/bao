# Cache

Cache 可以将一些数据临时保存，并在一定时间后自动过期。合理的缓存数据，可以有效的提高你应用的性能。

## 配置

目前，Bao 支持使用 Redis 来缓存数据。你可以在环境变量或 `/.env` 文件中添加 `REDIS_URL` 来告诉 Bao 要使用哪个 Redis 服务。

## 编写

例如，我们可以为每个用户的个人信息创建缓存。

```ts
import { defineNamespaceCache } from "southern-aurora-bao";

const cache = defineNamespaceCache<UserInfo>("user-info");
type UserInfo = {
  age: number;
  email: string;
}

await cache.set('alice', { age: 18, email: 'alice@gmail.com' }, 100);
console.log(await cache.get('alice'));
// echo: { age: 18, email: 'alice@gmail.com' }

await cache.del();
console.log(await cache.get());
// echo: undefined
```

## 全局缓存

前面，我们使用 `defineNamespaceCache` 创建的缓存是命名空间缓存，它适合存储集合数据的场景，就像存储用户信息，其中有许多用户。但是，有时你只需要缓存简单的数据，例如，你想要缓存一个布尔值，来表示是否开启了维护模式。这时候，就可以使用全局缓存。

你可以使用 `defineGlobalCache` 来定义一个全局缓存。

```ts
import { defineGlobalCache } from "southern-aurora-bao";

const cache = defineGlobalCache<boolean>("enable-maintenance-mode");

await cache.set(true, 100);
console.log(await cache.get());
// echo: true
```