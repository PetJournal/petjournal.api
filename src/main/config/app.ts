import express from 'express'
import setupMiddlewares from './middlewares'
import setupRoutes from './routes'
import setupSwagger from './swagger'

const app = express()
setupSwagger(app)
setupMiddlewares(app)
setupRoutes(app)
export default app
