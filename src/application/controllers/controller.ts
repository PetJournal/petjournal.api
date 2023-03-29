import { type HttpRequest, type HttpResponse } from 'application/helpers/http'

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
