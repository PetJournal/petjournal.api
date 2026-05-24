import { type Router } from 'express'
import { auth, accountConfirmation } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadCurrentDateTasksController, makeLoadCurrentWeekTasksController, makeLoadCurrentMonthTasksController, makeLoadNextTasksByPetIdController, makeLoadPreviousTasksByPetIdController, makeLoadNextTasksByPetIdAndTagIdController } from '../factories'

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
    '/tasks/pet/next/:petId/',
    auth,
    accountConfirmation,
    adaptRoute(makeLoadNextTasksByPetIdController())
  )

  router.get(
    '/tasks/pet/history/:petId',
    auth,
    accountConfirmation,
    adaptRoute(makeLoadPreviousTasksByPetIdController())
  )

  router.get(
    '/tasks/pet/:petId/tag/:tagId',
    auth,
    accountConfirmation,
    adaptRoute(makeLoadNextTasksByPetIdAndTagIdController())
  )
}
