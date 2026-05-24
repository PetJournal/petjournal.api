import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadDogBreedsController } from '../factories'

export default (router: Router): void => {
  router.get('/breeds/dog', auth, accountConfirmation, adaptRoute(makeLoadDogBreedsController()))
}
