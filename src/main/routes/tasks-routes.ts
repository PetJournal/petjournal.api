import { type Router } from 'express'
import { auth, accountConfirmation } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadCurrentDateTasksController } from '../factories'

export default (router: Router): void => {
  router.get(
    '/tasks/current-date',
    auth,
    accountConfirmation,
    adaptRoute(makeLoadCurrentDateTasksController())
  )
}
