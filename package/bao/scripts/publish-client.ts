/* eslint-disable no-console */
import { cwd, platform } from "node:process";
import { join } from "node:path";

export async function publishClient() {
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
