import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeCreateSchedulerController } from '../factories'

export default (router: Router): void => {
  router.post('/scheduler', auth, accountConfirmation, adaptRoute(makeCreateSchedulerController()))
}
