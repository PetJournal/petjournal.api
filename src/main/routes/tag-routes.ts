import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeAddTagController } from '../factories'

export default (router: Router): void => {
  router.post('/tag', auth, accountConfirmation, adaptRoute(makeAddTagController()))
}
