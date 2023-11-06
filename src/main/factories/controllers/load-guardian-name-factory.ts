import { LoadGuardianNameController } from '@/application/controllers'
import { makeDbLoadGuardianName } from '@/main/factories/usecases'
import { LoggerControllerDecorator } from '@/main/decorators'
import { LoggerPgRepository } from '@/infra/repos/postgresql'
import { type Controller } from '@/application/protocols'

export const makeLoadGuardianNameController = (): Controller => {
  const loadGuardianName = makeDbLoadGuardianName()
  const loadGuardianNameController = new LoadGuardianNameController({ loadGuardianName })
  const loggerPgRepository = new LoggerPgRepository()
  return new LoggerControllerDecorator(loadGuardianNameController, loggerPgRepository)
}
