import { DeleteSchedulerController } from '@/application/controllers'
import { NotAcceptableError } from '@/application/errors'
import { notAcceptable } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type DeleteScheduler } from '@/domain/use-cases'
import { makeFakeDeleteSchedulerRequest, makeFakeDeleteSchedulerUseCase, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: DeleteSchedulerController
  deleteSchedulerStub: DeleteScheduler
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const deleteSchedulerStub = makeFakeDeleteSchedulerUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: DeleteSchedulerController.Dependencies = {
    deleteScheduler: deleteSchedulerStub,
    validation: validationStub
  }
  const sut = new DeleteSchedulerController(dependencies)
  return {
    sut,
    deleteSchedulerStub,
    validationStub
  }
}

describe('DeleteScheduler Controller', () => {
  const httpRequest = makeFakeDeleteSchedulerRequest()
  describe('DeleteScheduler Use case', () => {
    it('Should return 406(Not Acceptable) if an invalid schedulerId is provided', async () => {
      const { sut, deleteSchedulerStub } = makeSut()
      jest.spyOn(deleteSchedulerStub, 'delete').mockResolvedValue({
        isSuccess: false,
        error: new NotAcceptableError('schedulerId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotAcceptableError('schedulerId')))
    })
  })
})
