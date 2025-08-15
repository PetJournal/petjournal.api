import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadSettingsController } from '../factories'

export default (router: Router): void => {
  router.get('/settings', auth, accountConfirmation, adaptRoute(makeLoadSettingsController()))
}
