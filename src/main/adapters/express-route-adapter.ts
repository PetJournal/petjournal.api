import { type Controller } from '@/application/controllers/controller'
import { type HttpResponse, type HttpRequest } from '@/application/helpers/http'
import { type Request, type Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      body: req.body
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200 || httpResponse.statusCode === 201) {
      res.status((httpResponse).statusCode).json(httpResponse.body)
    } else {
      res.status((httpResponse).statusCode).json({ error: httpResponse.body.message })
    }
  }
}
