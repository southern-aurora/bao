/**
 * ⚠️This file is generated and modifications will be overwritten
 */

import typia from 'typia'

// api
import type * as helloWorld$api from '../../src/app/hello-world/api'

export default {
  params: {
    'hello-world/say':  async (params: unknown) => typia.validateEquals<Parameters<typeof helloWorld$api['say']['action']>[0]>(params),
    
  },
}
