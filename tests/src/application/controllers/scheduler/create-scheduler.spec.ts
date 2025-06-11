import { CreateSchedulerController } from '@/application/controllers'
import { NotAcceptableError } from '@/application/errors'
import { notAcceptable } from '@/application/helpers'
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
  })
})
