import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeForgetPasswordController } from '@/main/factories'

export default (router: Router): void => {
  router.post('/forget-password', adaptRoute(makeForgetPasswordController()))
}
