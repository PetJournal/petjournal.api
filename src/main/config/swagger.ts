import swaggerConfig from '@/main/docs'
import { serve, setup } from 'swagger-ui-express'
import { type Express } from 'express'
import fs from 'fs'
import path from 'path'

export default (app: Express): void => {
  app.use('/api/docs/dark', serve, setup(swaggerConfig, {
    customCss: fs.readFileSync(path.join(__dirname, '..', '..', '..', 'styles', 'swagger-dark-theme.css'), 'utf-8')
  }))
  app.use('/api/docs', serve, setup(swaggerConfig))
}
