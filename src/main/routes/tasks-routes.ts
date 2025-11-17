import { type Router } from 'express'
import { auth, accountConfirmation } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadCurrentDateTasksController, makeLoadCurrentWeekTasksController, makeLoadCurrentMonthTasksController, makeLoadTasksByPetIdController } from '../factories'

export default (router: Router): void => {
  router.get(
    '/tasks/current-date',
    auth,
    accountConfirmation,
    adaptRoute(makeLoadCurrentDateTasksController())
  )
  router.get(
    '/tasks/current-week',
    auth,
    accountConfirmation,
    adaptRoute(makeLoadCurrentWeekTasksController())
  )
  router.get(
    '/tasks/current-month',
    auth,
    accountConfirmation,
    adaptRoute(makeLoadCurrentMonthTasksController())
  )

  router.get(
    '/tasks/by-pet/:petId',
    auth,
    accountConfirmation,
    adaptRoute(makeLoadTasksByPetIdController())
  )
}
