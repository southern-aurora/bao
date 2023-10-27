import "southern-aurora-bao/load-env-file";
import { createBaoApp } from "southern-aurora-bao";

// create bao
export const bao = await createBaoApp();

// start http server
await bao.executeHttpServer();
