import { NotAcceptableError } from '@/application/errors'
import { type DeleteEventByIdRepository, type LoadEventByIdRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { DbDeleteEventById } from '@/data/use-cases'
import { type DeleteEventById } from '@/domain/use-cases'
import { makeFakeEventRepository, makeFakeGuardianRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbDeleteEventById
  eventRepositoryStub: DeleteEventByIdRepository & LoadEventByIdRepository
  guardianRepositoryStub: LoadGuardianByIdRepository
}

const makeSut = (): SutTypes => {
  const eventRepositoryStub = makeFakeEventRepository()
  const guardianRepositoryStub = makeFakeGuardianRepository()
  const dependencies: DeleteEventById.Dependencies = {
    eventRepository: eventRepositoryStub,
    guardianRepository: guardianRepositoryStub
  }
  const sut = new DbDeleteEventById(dependencies)
  return {
    sut,
    eventRepositoryStub,
    guardianRepositoryStub
  }
}

describe('DbDeleteEvent Use case', () => {
  const params: DeleteEventById.Params = {
    eventId: 'any_event_id',
    guardianId: 'any_guardian_id'
  }

  describe('GuardianRepository', () => {
    describe('LoadById', () => {
      it('Should call loadById with correct value', async () => {
        const { sut, guardianRepositoryStub } = makeSut()
        const spyLoadGuardian = jest.spyOn(guardianRepositoryStub, 'loadById')
        await sut.deleteById(params)
        expect(spyLoadGuardian).toHaveBeenCalledWith(params.guardianId)
      })

      it('Should throw if LoadById throws', async () => {
        const { sut, guardianRepositoryStub } = makeSut()
        jest.spyOn(guardianRepositoryStub, 'loadById').mockRejectedValue(new Error())
        const promise = sut.deleteById(params)
        await expect(promise).rejects.toThrow()
      })

      it('Should return NotAcceptableError if an invalid guardianId is provided', async () => {
        const { sut, guardianRepositoryStub } = makeSut()
        jest.spyOn(guardianRepositoryStub, 'loadById').mockResolvedValueOnce(null)
        const result = await sut.deleteById(params)
        expect(result).toEqual({
          isSuccess: false,
          error: new NotAcceptableError('userId')
        })
      })
    })

    describe('EventRepository', () => {
      describe('LoadById', () => {
        it('Should call loadById with correct value', async () => {
          const { sut, eventRepositoryStub } = makeSut()
          const spyLoadEvent = jest.spyOn(eventRepositoryStub, 'loadById')
          await sut.deleteById(params)
          expect(spyLoadEvent).toHaveBeenCalledWith({ eventId: params.eventId, guardianId: params.guardianId })
        })
      })
    })
  })
})
