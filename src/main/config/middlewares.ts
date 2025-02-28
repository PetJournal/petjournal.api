import { type Express } from 'express'
import { bodyParser, contentType, cors, upload } from '@/main/middlewares'

export default (app: Express): void => {
  app.use(bodyParser)
  app.use(contentType)
  app.use(cors)
  app.use(upload)
}
