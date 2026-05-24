import { PetDeleteController } from '@/application/controllers'
import { InvalidParamError } from '@/application/errors'
import { notAcceptable, success } from '@/application/helpers'
import { type DeletePet } from '@/domain/use-cases'
import { makeFakeDeletePetRequest, makeFakeDeletePetUseCase, makeFakeServerError } from '@/tests/utils'

interface SutTypes {
  sut: PetDeleteController
  deletePetStub: DeletePet
}

const makeSut = (): SutTypes => {
  const deletePetStub = makeFakeDeletePetUseCase()
  const dependencies: PetDeleteController.Dependencies = {
    petDelete: deletePetStub
  }
  const sut = new PetDeleteController(dependencies)
  return {
    sut,
    deletePetStub
  }
}

describe('DeletePet Controller', () => {
  const httpRequest = makeFakeDeletePetRequest()
  it('Should return 406 (NotAcceptable) if invalid data is provided', async () => {
    const { sut, deletePetStub } = makeSut()
    jest.spyOn(deletePetStub, 'delete').mockResolvedValue({
      isSuccess: false,
      error: new InvalidParamError('anyField')
    })
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(notAcceptable(new InvalidParamError('anyField')))
  })

  it('Should return 500 (ServerError) if delete throws', async () => {
    const { sut, deletePetStub } = makeSut()
    jest.spyOn(deletePetStub, 'delete').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should call delete with correct values', async () => {
    const { sut, deletePetStub } = makeSut()
    const deletePetSpy = jest.spyOn(deletePetStub, 'delete')
    await sut.handle(httpRequest)
    expect(deletePetSpy).toHaveBeenCalledWith({
      guardianId: httpRequest.userId,
      petId: httpRequest.params.petId
    })
  })

  it('Should return 200 (success) if pet was deleted', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      message: 'Pet deleted',
      petId: 'any_id'
    }))
  })
})
