import { cwd, env } from "node:process";
import { envToBoolean, envToNumber, envToString } from "..";

export const configFramework = {
  cwd: cwd(),
  port: envToNumber(env.PORT, 9000),
  debug: envToBoolean(env.DEBUG, false),
  cacheType: envToString(env.CACHE_TYPE, "redis") as "redis",
  redisUrl: envToString(env.REDIS_URL, "redis://:123456@your-not-redis-url:6379"),
  ignorePathLevel: envToNumber(env.IGNORE_PATH_LEVEL, 0),
  corsAllowMethods: envToString(env.CORS_ALLOW_METHODS, "*"),
  corsAllowHeaders: envToString(env.CORS_ALLOW_HEADERS, "*"),
  corsAllowOrigin: envToString(env.CORS_ALLOW_ORIGIN, "*")
};
