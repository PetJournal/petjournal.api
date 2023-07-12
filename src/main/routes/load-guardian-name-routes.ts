import { type Router } from 'express'
import { auth } from '../middlewares'
import { makeLoadGuardianNameController } from '../factories/controllers'
import { adaptRoute } from '../adapters'

export default (router: Router): void => {
  router.get('/guardian/name', auth, adaptRoute(makeLoadGuardianNameController()))
}
