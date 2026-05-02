import { type DeleteEventsBySchedulerIdRepository, type DeleteSchedulerByIdRepository, type LoadGuardianByIdRepository, type LoadSchedulerByIdRepository } from '@/data/protocols'
import { DbDeleteScheduler } from '@/data/use-cases'
import { type DeleteScheduler } from '@/domain/use-cases'
import { makeFakeEventRepository, makeFakeGuardianRepository, makeFakeSchedulerRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbDeleteScheduler
  schedulerRepositoryStub: DeleteSchedulerByIdRepository & LoadSchedulerByIdRepository
  guardianRepositoryStub: LoadGuardianByIdRepository
  eventRepositoryStub: DeleteEventsBySchedulerIdRepository
}

const makeSut = (): SutTypes => {
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const schedulerRepositoryStub = makeFakeSchedulerRepository()
  const eventRepositoryStub = makeFakeEventRepository()
  const dependencies: DeleteScheduler.Dependencies = {
    guardianRepository: guardianRepositoryStub,
    schedulerRepository: schedulerRepositoryStub,
    eventRepository: eventRepositoryStub
  }
  const sut = new DbDeleteScheduler(dependencies)
  return {
    sut,
    guardianRepositoryStub,
    schedulerRepositoryStub,
    eventRepositoryStub
  }
}

describe('DbDeleteScheduler Use case', () => {
  const params: DeleteScheduler.Params = {
    guardianId: 'any_guardian_id',
    schedulerId: 'any_scheduler_id'
  }
  describe('GuardianRepository', () => {
    describe('LoadById', () => {
      it('Should call loadById with correct value', async () => {
        const { sut, guardianRepositoryStub } = makeSut()
        const spyLoadGuardian = jest.spyOn(guardianRepositoryStub, 'loadById')
        await sut.delete(params)
        expect(spyLoadGuardian).toHaveBeenCalledWith('any_guardian_id')
      })
    })
  })
})
