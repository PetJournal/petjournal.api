import { type Router } from 'express'
import { adaptRoute } from '../adapters'
import { makeCreateSchedulerController } from '../factories'
import { accountConfirmation, auth } from '../middlewares'

export default (router: Router): void => {
  router.post('/scheduler', auth, accountConfirmation, adaptRoute(makeCreateSchedulerController()))
}
