import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeChangePasswordController } from '@/main/factories'
import { auth } from '@/main/middlewares'

export default (router: Router): void => {
  router.post('/guardian/change-password', auth, adaptRoute(makeChangePasswordController()))
}
