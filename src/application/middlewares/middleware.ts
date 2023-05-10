import { type HttpRequest, type HttpResponse } from '@/application/helpers/http'

export interface Middleware {
  handle: (httpRequest: HttpRequest) => Promise<HttpResponse>
}
