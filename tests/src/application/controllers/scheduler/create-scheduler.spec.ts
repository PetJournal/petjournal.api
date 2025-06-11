import { CreateSchedulerController } from '@/application/controllers'
import { NotAcceptableError, ServerError } from '@/application/errors'
import { notAcceptable, serverError } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type AddScheduler } from '@/domain/use-cases'
import { makeFakeAddSchedulerRequest, makeFakeAddSchedulerUseCase, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: CreateSchedulerController
  addSchedulerStub: AddScheduler
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addSchedulerStub = makeFakeAddSchedulerUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: CreateSchedulerController.Dependencies = {
    addScheduler: addSchedulerStub,
    validation: validationStub
  }
  const sut = new CreateSchedulerController(dependencies)
  return {
    sut,
    addSchedulerStub,
    validationStub
  }
}

describe('CreateScheduler Controller', () => {
  const httpRequest = makeFakeAddSchedulerRequest()
  describe('AddScheduler Use case', () => {
    it('Should return 406(Not Acceptable) if invalid tagId is provided', async () => {
      const { sut, addSchedulerStub } = makeSut()
      jest.spyOn(addSchedulerStub, 'add').mockResolvedValue({
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotAcceptableError('tagId')))
    })

    it('Should return 406(Not Acceptable) if invalid petId is provided', async () => {
      const { sut, addSchedulerStub } = makeSut()
      jest.spyOn(addSchedulerStub, 'add').mockResolvedValue({
        isSuccess: false,
        error: new NotAcceptableError('petId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotAcceptableError('petId')))
    })

    it('Should return 500(Server Error) if add throws', async () => {
      const { sut, addSchedulerStub } = makeSut()
      jest.spyOn(addSchedulerStub, 'add').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError('Internal Server Error')))
    })

    it('Should call add with correct values', async () => {
      const { sut, addSchedulerStub } = makeSut()
      const addSpy = jest.spyOn(addSchedulerStub, 'add')
      await sut.handle(httpRequest)
      expect(addSpy).toHaveBeenCalledWith({
        tagId: httpRequest.body.tagId,
        guardianId: httpRequest.userId,
        title: httpRequest.body.title,
        description: httpRequest.body.description,
        note: httpRequest.body.note,
        startAt: httpRequest.body.startAt,
        endAt: httpRequest.body.endAt,
        daysOfWeek: httpRequest.body.daysOfWeek,
        daysOfMonth: httpRequest.body.daysOfMonth,
        daily: httpRequest.body.daily,
        pets: httpRequest.body.pets
      })
    })
  })
})
