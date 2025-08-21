import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadSettingsController, makeUpdateSettingsController } from '../factories'

export default (router: Router): void => {
  router.get('/settings', auth, accountConfirmation, adaptRoute(makeLoadSettingsController()))
  router.put('/settings', auth, accountConfirmation, adaptRoute(makeUpdateSettingsController()))
}
