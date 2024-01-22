import { type Router } from 'express'
import { auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadCatBreedsController } from '../factories'

export default (router: Router): void => {
  router.get('/breeds/cat', auth, adaptRoute(makeLoadCatBreedsController()))
}
