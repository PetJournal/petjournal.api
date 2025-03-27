import { UpdatePetController } from '@/application/controllers'
import { InvalidParamError } from '@/application/errors'
import { badRequest, success, notAcceptable } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type UpdatePet } from '@/domain/use-cases'
import { makeFakeUpdatePetUseCase, makeFakeUpdatePetRequest, makeFakeServerError, makeFakeValidation, mockFakePetAdded, mockFakePetUpdated } from '@/tests/utils'

interface SutTypes {
  sut: UpdatePetController
  updatePetStub: UpdatePet
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const validationStub = makeFakeValidation()
  const updatePetStub = makeFakeUpdatePetUseCase()
  const dependencies: UpdatePetController.Dependencies = {
    validation: validationStub,
    updatePet: updatePetStub
  }
  const sut = new UpdatePetController(dependencies)
  return { sut, validationStub, updatePetStub }
}

describe('UpdatePet Controller', () => {
  const httpRequest = makeFakeUpdatePetRequest()

  describe('UpdatePet', () => {
    it('Should return 406 (NotAcceptable) if invalid data is provided', async () => {
      const { sut, updatePetStub } = makeSut()
      jest.spyOn(updatePetStub, 'update').mockResolvedValue({
        isSuccess: false,
        error: new InvalidParamError('anyField')
      })

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(notAcceptable(new InvalidParamError('anyField')))
    })

    it('should return 500 (ServerError) if update throws', async () => {
      const { sut, updatePetStub } = makeSut()
      jest.spyOn(updatePetStub, 'update').mockRejectedValue(new Error())

      const httpResponse = await sut.handle(httpRequest)

      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should call update with correct values', async () => {
      const { sut, updatePetStub } = makeSut()
      const updatePetSpy = jest.spyOn(updatePetStub, 'update')

      await sut.handle(httpRequest)

      expect(updatePetSpy).toHaveBeenCalledWith({
        guardianId: httpRequest.userId,
        petId: httpRequest.params.petId,
        specieName: httpRequest.body.specieName,
        petName: httpRequest.body.petName,
        gender: httpRequest.body.gender,
        breedName: httpRequest.body.breedName,
        size: httpRequest.body.size,
        castrated: httpRequest.body.castrated,
        dateOfBirth: httpRequest.body.dateOfBirth
      })
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

      expect(validateSpy).toHaveBeenCalledWith({ ...httpRequest.body, ...httpRequest.params })
    })
  })

  it('should return 200 (success) if empty data is provided', async () => {
    const { sut } = makeSut()
    const { body, ...httpRequestWithoutBody } = { ...httpRequest }

    const httpResponse = await sut.handle(httpRequestWithoutBody)

    expect(httpResponse).toEqual(success({ ...mockFakePetAdded(), image: 'any_image' }))
  })

  it('should return 200 (success) if valid data is provided', async () => {
    const { sut } = makeSut()

    const entries = Object.entries(httpRequest.body)
    const f = async (prefix: any, entries: any): Promise<void> => {
      for (let i = 0; i < entries.length; i++) {
        Object.assign(httpRequest, { body: { ...Object.fromEntries([...prefix, entries[i]]) } })
        const httpResponse = await sut.handle(httpRequest)
        expect(httpResponse).toEqual(success(mockFakePetUpdated()))
        await f([...prefix, entries[i]], entries.slice(i + 1))
      }
    }
    await f([], entries)
  })
})
