
/**
 * ⚠️This file is generated and modifications will be overwritten
 */
 
// api
import type * as helloWorld2$api from '../src/app/hello-world-2/api'
import type * as helloWorld$api from '../src/app/hello-world/api'

// api methods type
import type * as helloWorld2 from '../src/app/hello-world-2/api'

import type * as helloWorld from '../src/app/hello-world/api'

import _apiParams from './products/api-params'

export default {
  apiParams: _apiParams,
  apiMethodsSchema: {
    // hello-world-2/api
    'hello-world-2/say': () => ({ module: import('../src/app/hello-world-2/api'), method: 'say' }),
    
    // hello-world/api
    'hello-world/say': () => ({ module: import('../src/app/hello-world/api'), method: 'say' }),
    
  },
  apiMethodsTypeSchema: {
    // hello-world-2/api
    'hello-world-2/say': undefined as unknown as typeof helloWorld2['say'],
    
    // hello-world/api
    'hello-world/say': undefined as unknown as typeof helloWorld['say'],
    
  },
}
 