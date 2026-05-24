import { type Router } from 'express'
import { accountConfirmation, auth } from '../middlewares'
import { adaptRoute } from '../adapters'
import { makeLoadDogSizesController } from '../factories/controllers/pet/load-dog-sizes-factory'

export default (router: Router): void => {
  router.get('/sizes/dog', auth, accountConfirmation, adaptRoute(makeLoadDogSizesController()))
}
