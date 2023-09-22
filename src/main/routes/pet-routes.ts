import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { auth } from '@/main/middlewares'
import { makePetRegistryController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/pet', auth, adaptRoute(makePetRegistryController()))
}
