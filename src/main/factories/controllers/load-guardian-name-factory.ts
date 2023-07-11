import { LoadGuardianNameController } from '@/application/controllers'
import { makeDbGetGuardianName } from '../usecases'
import { LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { type Controller } from '@/application/protocols'

export const makeLoadGuardianNameController = (): Controller => {
  const getGuardianName = makeDbGetGuardianName()
  const loadGuardianNameController = new LoadGuardianNameController({ getGuardianName })
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(loadGuardianNameController, loggerPgRepository)
}
