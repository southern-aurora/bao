/**
 * ⚠️This file is generated and modifications will be overwritten
 */

import typia from 'typia'

// api
import type * as helloWorld2$api from '../../src/app/hello-world-2/api'
import type * as helloWorld$api from '../../src/app/hello-world/api'

export default {
  params: {
    'hello-world-2/say':  async (params: unknown) => typia.validateEquals<Parameters<typeof helloWorld2$api['say']['action']>[0]>(params),
    
    'hello-world/say':  async (params: unknown) => typia.validateEquals<Parameters<typeof helloWorld$api['say']['action']>[0]>(params),
    
  },
}
