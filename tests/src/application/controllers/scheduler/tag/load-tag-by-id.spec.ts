import { LoadTagByIdController } from '@/application/controllers'
import { type LoadTagById } from '@/domain/use-cases'
import { makeFakeLoadTagByIdUseCase } from '@/tests/utils'

interface SutTypes {
  sut: LoadTagByIdController
  loadTagStub: LoadTagById
}

const makeSut = (): SutTypes => {
  const loadTagStub = makeFakeLoadTagByIdUseCase()
  const dependencies: LoadTagByIdController.Dependencies = {
    loadTag: loadTagStub
  }
  const sut = new LoadTagByIdController(dependencies)
  return {
    sut,
    loadTagStub
  }
}

describe('LoadTagById Controller', () => {
  const httpRequest = {
    body: {
      tagId: 'any_id'
    }
  }
  describe('LoadTag', () => {
    it('Should call LoadTag with correct value', async () => {
      const { sut, loadTagStub } = makeSut()
      const loadTagSpy = jest.spyOn(loadTagStub, 'loadById')
      await sut.handle(httpRequest)
      expect(loadTagSpy).toHaveBeenCalledWith('any_id')
    })
  })
})
