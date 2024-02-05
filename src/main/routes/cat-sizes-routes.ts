import { type Router } from 'express'
import { auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadCatSizesController } from '../factories/controllers/pet/load-cat-sizes-factory'

export default (router: Router): void => {
  router.get('/sizes/cat', auth, adaptRoute(makeLoadCatSizesController()))
}
