import { NotAcceptableError, ServerError } from '@/application/errors'
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

      it('Should throw if LoadById throws', async () => {
        const { sut, guardianRepositoryStub } = makeSut()
        jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())
        const promise = sut.delete(params)
        await expect(promise).rejects.toThrow()
      })

      it('Should return NotAcceptableError if an invalid guardianId is provided', async () => {
        const { sut, guardianRepositoryStub } = makeSut()
        jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
        const result = await sut.delete(params)
        expect(result).toEqual({
          isSuccess: false,
          error: new NotAcceptableError('UserId')
        })
      })
    })
  })

  describe('SchedulerRepository', () => {
    describe('Load', () => {
      it('Should call load with correct value', async () => {
        const { sut, schedulerRepositoryStub } = makeSut()
        const spyLoadScheduler = jest.spyOn(schedulerRepositoryStub, 'load')
        await sut.delete(params)
        expect(spyLoadScheduler).toHaveBeenCalledWith({ guardianId: 'any_id', schedulerId: params.schedulerId })
      })

      it('Should throw if Load throws', async () => {
        const { sut, schedulerRepositoryStub } = makeSut()
        jest.spyOn(schedulerRepositoryStub, 'load').mockRejectedValue(new Error())
        const promise = sut.delete(params)
        await expect(promise).rejects.toThrow()
      })

      it('Should return NotAcceptableError if an invalid schedulerId is provided', async () => {
        const { sut, schedulerRepositoryStub } = makeSut()
        jest.spyOn(schedulerRepositoryStub, 'load').mockResolvedValueOnce(null)
        const result = await sut.delete(params)
        expect(result).toEqual({
          isSuccess: false,
          error: new NotAcceptableError('SchedulerId')
        })
      })
    })

    describe('Delete', () => {
      it('Should call delete with correct values', async () => {
        const { sut, schedulerRepositoryStub } = makeSut()
        const spyDeleteScheduler = jest.spyOn(schedulerRepositoryStub, 'delete')
        await sut.delete(params)
        expect(spyDeleteScheduler).toHaveBeenCalledWith({ guardianId: 'any_id', schedulerId: params.schedulerId })
      })

      it('Should return ServerError if an invalid schedulerId is provided', async () => {
        const { sut, schedulerRepositoryStub } = makeSut()
        jest.spyOn(schedulerRepositoryStub, 'delete').mockResolvedValueOnce(false)
        const result = await sut.delete({ schedulerId: 'invalid_scheduler_id', guardianId: params.guardianId })
        expect(result).toEqual({
          isSuccess: false,
          error: new ServerError('delete error')
        })
      })
    })
  })

  describe('EventRepository', () => {
    describe('Delete', () => {
      it('Should call delete with correct values', async () => {
        const { sut, eventRepositoryStub } = makeSut()
        const spyDeleteEvent = jest.spyOn(eventRepositoryStub, 'delete')
        await sut.delete(params)
        expect(spyDeleteEvent).toHaveBeenCalledWith({ guardianId: 'any_id', schedulerId: params.schedulerId })
      })

      it('Should return ServerError if an invalid schedulerId is provided', async () => {
        const { sut, eventRepositoryStub } = makeSut()
        jest.spyOn(eventRepositoryStub, 'delete').mockResolvedValueOnce(false)
        const result = await sut.delete({ schedulerId: 'invalid_scheduler_id', guardianId: params.guardianId })
        expect(result).toEqual({
          isSuccess: false,
          error: new ServerError('delete error')
        })
      })
    })
  })
})
