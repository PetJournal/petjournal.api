import { type Express } from 'express'
import { bodyParser, contentType, cors, helmet } from '@/main/middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(contentType)
  app.use(cors)
  app.use(helmet)
}
