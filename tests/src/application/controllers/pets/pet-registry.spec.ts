import { PetRegistryController } from '@/application/controllers'
import { badRequest } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type AddPet } from '@/domain/use-cases'
import { makeFakeAddPetUseCase, makeFakePetRegistryRequest, makeFakeServerError, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: PetRegistryController
  addPetStub: AddPet
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const addPetStub = makeFakeAddPetUseCase()
  const dependencies: PetRegistryController.Dependencies = {
    validation: validationStub,
    addPet: addPetStub
  }
  const sut = new PetRegistryController(dependencies)
  return { sut, validationStub, addPetStub }
}

describe('PetRegistry Controller', () => {
  const httpRequest = makeFakePetRegistryRequest()

  describe('AddPet', () => {
    it('should return 500 (ServerError) if add throws', async () => {
      const { sut, addPetStub } = makeSut()
      jest.spyOn(addPetStub, 'add').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })
  })

  describe('Validation', () => {
    it('Should return 400 (BadRequest) if Validation returns an error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(badRequest(new Error()))
    })

    it('Should call Validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validateSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(httpRequest)
      expect(validateSpy).toHaveBeenCalledWith({
        guardianId: httpRequest.body.guardianId,
        specieId: httpRequest.body.specieId,
        otherAlias: httpRequest.body.otherAlias
      })
    })
  })
})