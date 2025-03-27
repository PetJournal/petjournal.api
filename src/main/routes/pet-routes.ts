import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { accountConfirmation, auth, booleanParser, upload } from '@/main/middlewares'
import { makeLoadPetsController, makePetDeleteController, makePetRegistryController, makeUpdatePetController } from '@/main/factories'

export default (router: Router): void => {
  router.get('/pet', auth, accountConfirmation, adaptRoute(makeLoadPetsController()))
  router.post('/pet', auth, accountConfirmation, upload, booleanParser('castrated'), adaptRoute(makePetRegistryController()))
  router.put('/pet/:petId', auth, accountConfirmation, adaptRoute(makeUpdatePetController()))
  router.delete('/pet/:petId', auth, accountConfirmation, adaptRoute(makePetDeleteController()))
}
