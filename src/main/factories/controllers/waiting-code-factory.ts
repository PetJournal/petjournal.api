import { WaitingCodeController } from '@/application/controllers'
import { type Controller } from '@/application/protocols'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { LoggerControllerDecorator } from '@/main/decorators'
import { makeWaitingCodeValidation } from '@/main/factories/validations'
import {
  makeDbCreateAccessToken,
  makeDbValidateVerificationToken
} from '@/main/factories/usecases'

export const makeWaitingCodeController = (): Controller => {
  const validation = makeWaitingCodeValidation()
  const validateVerificationToken = makeDbValidateVerificationToken()
  const createAccessToken = makeDbCreateAccessToken()
  const loggerPgRepository = new LoggerPgRepository()
  const waitingCodeController = new WaitingCodeController({
    validation,
    validateVerificationToken,
    createAccessToken
  })
  return new LoggerControllerDecorator(waitingCodeController, loggerPgRepository)
}
