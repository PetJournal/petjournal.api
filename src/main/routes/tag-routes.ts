import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeAddTagController, makeLoadTagByIdController, makeUpdateTagController } from '../factories'

export default (router: Router): void => {
  router.post('/tag', auth, accountConfirmation, adaptRoute(makeAddTagController()))
  router.put('/tag/:tagId', auth, accountConfirmation, adaptRoute(makeUpdateTagController()))
  router.get('/tag/:tagId', auth, accountConfirmation, adaptRoute(makeLoadTagByIdController()))
}
