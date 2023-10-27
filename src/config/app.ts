import { env } from "node:process";
import { envToBoolean } from "southern-aurora-bao";

export const configApp = {
  enableSayHelloWorld: envToBoolean(env.ENABLE_SAY_HELLO_WORLD, true)
};
