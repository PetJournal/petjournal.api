import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeAddTagController, makeDeleteTagByIdController, makeLoadTagByIdController, makeLoadTagsController, makeUpdateTagController } from '../factories'

export default (router: Router): void => {
  router.post('/tag', auth, accountConfirmation, adaptRoute(makeAddTagController()))
  router.put('/tag/:tagId', auth, accountConfirmation, adaptRoute(makeUpdateTagController()))
  router.get('/tag/:tagId', auth, accountConfirmation, adaptRoute(makeLoadTagByIdController()))
  router.get('/tag', auth, accountConfirmation, adaptRoute(makeLoadTagsController()))
  router.delete('/tag/:tagId', auth, accountConfirmation, adaptRoute(makeDeleteTagByIdController()))
}
