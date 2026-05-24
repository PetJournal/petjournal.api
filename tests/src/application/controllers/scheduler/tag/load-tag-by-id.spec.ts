import { LoadTagByIdController } from '@/application/controllers'
import { NotAcceptableError } from '@/application/errors'
import { serverError, success } from '@/application/helpers'
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
    params: {
      tagId: 'any_id'
    },
    userId: 'any_guardian_id'
  }
  describe('LoadTag', () => {
    it('Should call LoadTag with correct value', async () => {
      const { sut, loadTagStub } = makeSut()
      const loadTagSpy = jest.spyOn(loadTagStub, 'loadById')
      await sut.handle(httpRequest)
      expect(loadTagSpy).toHaveBeenCalledWith({ guardianId: 'any_guardian_id', tagId: 'any_id' })
    })

    it('Should return 500(serverError) if loadTag throws', async () => {
      const { sut, loadTagStub } = makeSut()
      jest.spyOn(loadTagStub, 'loadById').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new NotAcceptableError('Internal Server Error!')))
    })
  })

  it('Should return a tag on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      id: 'any_id',
      guardianId: 'any_guardian_id',
      name: 'any_name',
      color: 'any_color'
    }))
  })
})
