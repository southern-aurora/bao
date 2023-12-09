/// <reference path="../types.d.ts" />
/* eslint-disable no-console */

import { existsSync, mkdirSync } from "node:fs";
import { join } from "node:path";
import { cwd, exit, stdout } from "node:process";
import { readdir, unlink, writeFile } from "node:fs/promises";
import { exec as nodeExec } from "node:child_process";
import walkSync from "walk-sync";
import ejs from "ejs";
import { camel, hyphen } from "@poech/camel-hump-under";
import { logger } from "../../../src/logger";
import { removeDir } from "../util/remove-dir";

stdout.write("- Bao Generating..");

void (() => {
  const P = ["- Bao Generating..", "\\ Bao Generating..", "| Bao Generating..", "/ Bao Generating.."];
  let x = 0;
  return setInterval(() => {
    stdout.write(`\r${P[x++]}`);
    x &= P.length - 1;
  }, 64);
})();

export async function generateSchema() {
  existsSync(join("generate")) || mkdirSync(join("generate"));
  existsSync(join("generate", "raw")) || mkdirSync(join("generate", "raw"));

  const utils = {
    camel: (str: string) => camel(str).replaceAll("-", "").replaceAll("_", ""),
    hyphen: (str: string) => hyphen(str).replaceAll("_", "")
  };

  await unlink(join(cwd(), "generate", "api-schema.ts"));
  await unlink(join(cwd(), "generate", "bootstrap-schema.ts"));
  //
  await writeFile(
    join(cwd(), "generate", "api-schema.ts"),
    ejs.render(
      `
  export default {
    apiParams: {},
    apiMethodsSchema: {},
    apiMethodsTypeSchema: {},
  }
   `,
      { utils }
    )
  );
  //
  await writeFile(
    join(cwd(), "generate", "bootstrap-schema.ts"),
    ejs.render(
      `
  export default {
    bootstrapSchema: {},
  }
   `,
      { utils }
    )
  );

  const apiPaths = await (async () => {
    return walkSync(join(cwd(), "src", "app"), {
      directories: false
    }).filter((path) => path.endsWith("/api.ts"));
  })();
  const apiMethods = await (async () => {
    const methods: Record<string, Array<string>> = {};
    for (const apiPath of apiPaths) {
      const apiPathExtensionless = apiPath.slice(0, -3);
      const module = await import(/* @vite-ignore */ `../../../src/app/${apiPathExtensionless}.ts`);
      methods[apiPathExtensionless] = [];
      for (const key in module) {
        if (!apiPathExtensionless.startsWith("_") && module[key].isApi === true) {
          methods[apiPathExtensionless].push(key);
        }
      }
    }
    return methods;
  })();
  const bootstrapPaths = await (async () => {
    return (await readdir(join(cwd(), "src", "bootstrap"))).filter((path) => path.endsWith(".ts"));
  })();
  const templateVars = {
    apiPaths,
    apiMethods,
    bootstrapPaths,
    utils
  };

  // api-schema
  await writeFile(
    join(cwd(), "generate", "api-schema.ts"),
    ejs.render(
      `
/**
 * ⚠️This file is generated and modifications will be overwritten
 */
 
// api
<% for (const path of ${"apiPaths"}) { %>import type * as <%= utils.camel(path.slice(0, -3).replaceAll('/', '$')) %> from '${"../src/app"}/<%= path.slice(0, -3) %>'
<% } %>
// api methods type<% for (const path in apiMethods) { %>
import type * as <%= utils.camel(path.slice(0, -${4}).replaceAll('/', '$')) %> from '../src/app/<%= path %>'
<% } %>
import _apiParams from './products/api-params'

export default {
  apiParams: _apiParams,
  ${"apiMethodsSchema"}: {<% for (const path in apiMethods) { %>
    // <%= path %>
    <% for (const path2 of apiMethods[path]) { %>'<%= utils.hyphen(path.slice(0, -${4})) %>/<%= utils.hyphen(path2) %>': () => ({ module: import('../src/app/<%= path %>'), method: '<%= path2 %>' }),
    <% } %><% } %>
  },
  ${"apiMethodsTypeSchema"}: {<% for (const path in apiMethods) { %>
    // <%= path %>
    <% for (const path2 of apiMethods[path]) { %>'<%= utils.hyphen(path.slice(0, -${4})) %>/<%= utils.hyphen(path2) %>': undefined as unknown as typeof <%= utils.camel(path.slice(0, -${4}).replaceAll('/', '$')) %>['<%= path2 %>'],
    <% } %><% } %>
  },
}
 `,
      templateVars
    )
  );

  // bootstrap-schema
  await writeFile(
    join(cwd(), "generate", "bootstrap-schema.ts"),
    ejs.render(
      `
/**
 * ⚠️This file is generated and modifications will be overwritten
 */

// bootstrap
<% for (const path of ${"bootstrapPaths"}) { %>import <%= utils.camel(path.slice(0, -3).replaceAll('/', '$') + '${"$bootstrap"}') %> from '${"../src/bootstrap"}/<%= path.slice(0, -3) %>'
<% } %>
 
export default {
  ${"bootstrapSchema"}: {<% for (const path of ${"bootstrapPaths"}) { %>
    '<%= utils.hyphen(path.slice(0, -${3})) %>': <%= utils.camel(path.slice(0, -3).replaceAll('/', '$') + '${"$bootstrap"}') %>,<% } %>
  },
}
 `,
      templateVars
    )
  );

  // api
  const apiParamsTemplate = `/**
 * ⚠️This file is generated and modifications will be overwritten
 */

import typia from 'typia'

// api
<% for (const path of ${"apiPaths"}) { %>import type * as <%= utils.camel(path.slice(0, -3).replaceAll('/', '$')) %> from '${"../../src/app"}/<%= path.slice(0, -3) %>'
<% } %>
export default {
  ${"params"}: {<% for (const path in apiMethods) { %>
    <% for (const path2 of apiMethods[path]) { %>'<%= utils.hyphen(path.slice(0, -${4})) %>/<%= utils.hyphen(path2) %>':  async (params: unknown) => typia.validateEquals<Parameters<typeof <%= utils.camel(path.replaceAll('/', '$')) %>['<%= path2 %>']['action']>[0]>(params),
    <% } %><% } %>
  },
}
`;
  await writeFile(join(cwd(), "generate", "raw", "api-params.ts"), ejs.render(apiParamsTemplate, templateVars));

  await new Promise((resolve) =>
    nodeExec("bunx typia generate --input generate/raw --output generate/products --project tsconfig.json", (e) => {
      resolve(e);
    })
  );
  // await unlink(join(cwd(), 'generate', 'raw', 'api-params.ts'))
}

// async function generateClient() {
//   const root = join(cwd(), "package", "client");

//   removeDir(join(root, "package"));
//   removeDir(join(root, "dist"));

//   await new Promise((resolve) =>
//     nodeExec("cd ./package/client && bunx tsc --outDir ./dist", (e) => {
//       resolve(e);
//     })
//   );

//   // build /src/client/index.ts to js
//   await Bun.build({
//     entrypoints: ["./package/client/index.ts"],
//     outdir: "./package/client/dist/package/client"
//   });

//   removeDir(join(root, "dist", "package"), [join(root, "dist", "package", "client")]);
//   removeDir(join(root, "dist", "src"), [join(root, "dist", "src", "fail-code.d.ts")]);
//   removeDir(join(root, "dist"), [join(root, "dist", "generate"), join(root, "dist", "package"), join(root, "dist", "src")]);
// }

await generateSchema();

stdout.write("\r");
stdout.clearLine(1);
logger.log("✅ Bao Generated!");

exit(0);
