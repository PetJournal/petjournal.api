import { type HttpResponse, serverError } from '@/application/helpers/http'

const makeFakeServerError = (): HttpResponse => {
  const fakeError = new Error()
  fakeError.stack = 'any_stack'
  return serverError(fakeError)
}

export {
  makeFakeServerError
}
