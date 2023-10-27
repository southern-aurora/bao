import { createServer } from 'vite'
import { ViteNodeServer } from 'vite-node/server'
import { ViteNodeRunner } from 'vite-node/client'
import { installSourcemapsSupport } from 'vite-node/source-map'
import * as dotenv from 'dotenv'

dotenv.config({ override: true })

export async function bootstrap(path) {
  // create vite server
  const server = await createServer({
    server: {
      // 对于后端应用来说，不需要开启 hmr
      // 当有文件变化时，直接重新启动服务即可
      hmr: false,
    },
    optimizeDeps: {
      // It's recommended to disable deps optimization
      disabled: true,
    },
  })
  // this is need to initialize the plugins
  await server.pluginContainer.buildStart({})

  // create vite-node server
  const node = new ViteNodeServer(server)

  // fixes stacktraces in Errors
  installSourcemapsSupport({
    getSourceMap: source => node.getSourceMap(source),
  })

  // create vite-node runner
  const runner = new ViteNodeRunner({
    // debug: true,
    root: server.config.root,
    base: server.config.base,
    // when having the server and runner in a different context,
    // you will need to handle the communication between them
    // and pass to this function
    fetchModule(id) {
      return node.fetchModule(id)
    },
    resolveId(id, importer) {
      return node.resolveId(id, importer)
    },
  })

  // execute the file
  await runner.executeFile(path)

  // close the vite server
  await server.close()
}
