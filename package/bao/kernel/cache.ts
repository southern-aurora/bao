import SuperJSON from "superjson";
import { configFramework } from "..";
import { createClient } from "redis";

export type CacheEntity<T> = T;

async function createRedisClient() {
  return await createClient({
    url: configFramework.redisUrl
  }).connect();
}

let redisClient: Awaited<ReturnType<typeof createRedisClient>> | undefined;
export async function useRedisClient() {
  if (redisClient === undefined) {
    redisClient = await createRedisClient();
  }
  return redisClient;
}

export function defineNamespaceCache<Entity extends CacheEntity<unknown>>(key: string) {
  return {
    async get(namespace: string): Promise<Entity | undefined> {
      const redisClient = await useRedisClient();
      const res = await redisClient.get(`${key}:${namespace}`);
      if (res === null) return undefined;
      return SuperJSON.parse<Entity>(res);
    },
    async set(namespace: string, value: Entity, ttl: number) {
      const redisClient = await useRedisClient();
      await redisClient.set(`${key}:${namespace}`, SuperJSON.stringify(value), {
        EX: ttl
      });
    },
    async del(namespace: string) {
      const redisClient = await useRedisClient();
      await redisClient.del(`${key}:${namespace}`);
    }
  };
}

export function defineGlobalCache<Entity extends CacheEntity<unknown>>(key: string) {
  const ncache = defineNamespaceCache<Entity>(key);
  return {
    async get() {
      return await ncache.get("global");
    },
    async set(value: Entity, ttl: number) {
      await ncache.set("global", value, ttl);
    },
    async del() {
      await ncache.del("global");
    }
  };
}
