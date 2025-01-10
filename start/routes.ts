/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import transmit from '@adonisjs/transmit/services/main'
const JobsController = () => import('#controllers/jobs_controller')

transmit.registerRoutes()

router.get('/', async () => {
  return {
    hello: 'calo',
  }
})
router.get('jobs', [JobsController, 'list'])
router.get('jobs/:id', [JobsController, 'get'])
router.post('jobs', [JobsController, 'create'])
