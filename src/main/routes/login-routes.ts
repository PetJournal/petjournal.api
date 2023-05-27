import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeLoginController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/login', adaptRoute(makeLoginController()))
}
