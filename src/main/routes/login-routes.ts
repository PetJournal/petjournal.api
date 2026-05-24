import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoginController } from '@/main/factories'
import { accountConfirmation } from '../middlewares'

export default (router: Router): void => {
  router.post('/login', accountConfirmation, adaptRoute(makeLoginController()))
}
