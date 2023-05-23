import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeForgetPasswordController } from '../factories/controllers/forget-password-factory'

export default (router: Router): void => {
  router.post('/forget-password', adaptRoute(makeForgetPasswordController()))
}
