import { type Router } from 'express'
import { adaptRoute } from '@/main/adapters'
import { makeSignUpController } from '@/main/factories'
import { upload } from '../middlewares'

export default (router: Router): void => {
  router.post('/signup', upload, adaptRoute(makeSignUpController()))
}
