import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters/express-route-adapter'
import { makeWaitingCodeController } from '@/main/factories/controllers'

export default (router: Router): void => {
  router.post('/waiting-code', adaptRoute(makeWaitingCodeController()))
}
