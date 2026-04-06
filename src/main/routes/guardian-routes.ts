import { type Router } from 'express'
import { accountConfirmation, auth, upload } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeUpdateGuardianController } from '../factories'

export default (router: Router): void => {
  router.put('/guardian/:guardianId', auth, accountConfirmation, upload, adaptRoute(makeUpdateGuardianController()))
}
