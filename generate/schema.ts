/**
 * ⚠️This file is generated and modifications will be overwritten
 */

// api
import type * as helloWorld$api from '../src/app/hello-world/api'

// bootstrap
import middlewareYourExample1$bootstrap from '../src/bootstrap/middleware-your-example-1'

// api methods type
import type * as helloWorld from '../src/app/hello-world/api'

import _apiParams from './products/api-params'

export default {
  apiParams: _apiParams,
  apiMethodsSchema: {
    // hello-world/api
    'hello-world/say': () => ({ module: import('../src/app/hello-world/api'), method: 'say' }),
    
  },
  apiMethodsTypeSchema: {
    // hello-world/api
    'hello-world/say': undefined as unknown as typeof helloWorld['say'],
    
  },
  bootstrapSchema: {
    'middleware-your-example-1': middlewareYourExample1$bootstrap,
  },
}
