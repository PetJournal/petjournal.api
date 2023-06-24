import { type Controller } from '@/application/protocols'
import { WaitingCodeController } from '@/application/controllers'
import { LoggerControllerDecorator } from '@/main/decorators/logger'
import { makeDbAuthentication, makeWaitingCodeValidation } from '@/main/factories'
import { LoggerPgRepository } from '@/infra/repos/postgresql'

export const makeWaitingCodeController = (): Controller => {
  const authentication = makeDbAuthentication()
  const validation = makeWaitingCodeValidation()
  const loggerPgRepository = new LoggerPgRepository()
  const waitingCodeController = new WaitingCodeController({
    authentication,
    validation
  })
  return new LoggerControllerDecorator(waitingCodeController, loggerPgRepository)
}
