import { type Controller } from '@/application/protocols'
import { type HttpResponse, type HttpRequest } from '@/application/helpers'
import { type Request, type Response } from 'express'

export const adaptRoute = (controller: Controller) => {
  return async (req: Request, res: Response) => {
    const httpRequest: HttpRequest = {
      params: req.params,
      body: req.body,
      userId: req.userId,
      file: req.file?.buffer
    }
    const httpResponse: HttpResponse = await controller.handle(httpRequest)
    if (httpResponse.statusCode === 200 || httpResponse.statusCode === 201) {
      res.status((httpResponse).statusCode).json(httpResponse.body)
    } else {
      res.status((httpResponse).statusCode).json({ error: httpResponse.body.message })
    }
  }
}
