import { type Router } from 'express'
import { auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadDogBreedsController } from '../factories'

export default (router: Router): void => {
  router.get('/breeds/dog', auth, adaptRoute(makeLoadDogBreedsController()))
}
