/* eslint-disable no-console */
import { cwd, platform } from "node:process";
import { exec as nodeExec } from "node:child_process";
import { removeDir } from "../util/remove-dir";
import { join } from "node:path";
import { copyFile } from "node:fs/promises";

export async function publishClient() {
  removeDir(join(cwd(), "package", "client", "dist"));
  removeDir(join(cwd(), "package", "client", "generate"));

  // 将项目中的文件生成对应的类型，并输出到 /package/client/generate 目录下
  await new Promise((resolve) =>
    nodeExec("bunx tsc --project tsconfig.client-generate.json", (e) => {
      resolve(e);
    })
  );
  await copyFile(join(cwd(), "src", "fail-code.ts"), join(cwd(), "package", "client", "generate", "src", "fail-code.ts"));

  // 为 client 打包类型
  await new Promise((resolve) =>
    nodeExec("cd ./package/client && bunx tsc", (e) => {
      resolve(e);
    })
  );

  // build /src/client/index.ts to js
  await Bun.build({
    entrypoints: ["./package/client/index.ts"],
    outdir: "./package/client"
  });

  const root = join(cwd(), "package", "client");

  console.log("🧊 If there are no errors, please manual publish:");
  console.log("\x1B[2m");
  console.log("Now, your latest code (including changes to your interface) is built to the latest version and waiting for your release!");

  if (platform !== "win32") {
    console.log("You can publish it to npm by running this commands:");
    console.log("\u001B[0m---");
    console.log(`cd ${join(root)} \\`);
    console.log("  && npm version major \\");
    console.log("  && npm publish --access public \\");
    console.log(`  && cd ${join(cwd())}`);
  } else {
    console.log("You can publish it to npm by running this commands (use \x1B[42mPowerShell\x1B[0m):");
    console.log("\u001B[0m---");
    console.log('$ErrorActionPreference = "Stop";');
    console.log(`Set-Location ${join(root)};`);
    console.log("npm version major;");
    console.log("npm publish --access public;");
    console.log(`Set-Location ${join(cwd())};`);
  }
  console.log("---");
}

await publishClient();
