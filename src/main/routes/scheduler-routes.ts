import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeCreateSchedulerController, makeDeleteSchedulerController } from '../factories'

export default (router: Router): void => {
  router.post('/scheduler', auth, accountConfirmation, adaptRoute(makeCreateSchedulerController()))
  router.delete('/scheduler/:schedulerId', auth, accountConfirmation, adaptRoute(makeDeleteSchedulerController()))
}
