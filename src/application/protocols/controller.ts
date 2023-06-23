import { type HttpRequest, type HttpResponse } from '@/application/helpers'

export interface Controller {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
