import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeLoginController } from '@/main/factories/controllers/login-controller-factory'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}
