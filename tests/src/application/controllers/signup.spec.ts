import { type AddGuardian } from '@/domain/use-cases'
import { type Validation } from '@/application/protocols'
import { SignUpController } from '@/application/controllers'
import {
  makeFakeAddGuardianUseCase,
  makeFakeServerError,
  makeFakeSignUpRequest,
  makeFakeValidation
} from '@/tests/utils'
import { conflict, create } from '@/application/helpers'
import { ConflictGuardianError } from '@/application/errors'

interface SutTypes {
  sut: SignUpController
  addGuardianStub: AddGuardian
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addGuardianStub = makeFakeAddGuardianUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: SignUpController.Dependencies = {
    addGuardian: addGuardianStub,
    validation: validationStub
  }
  const sut = new SignUpController(dependencies)
  return { sut, addGuardianStub, validationStub }
}

describe('SignUp Controller', () => {
  describe('AddGuardian', () => {
    it('Should call AddGuardian with correct values', async () => {
      const { sut, addGuardianStub } = makeSut()
      const httpRequest = makeFakeSignUpRequest()
      const addGuardianSpy = jest.spyOn(addGuardianStub, 'add')
      await sut.handle(httpRequest)
      expect(addGuardianSpy).toHaveBeenCalledWith({
        firstName: httpRequest.body.firstName,
        lastName: httpRequest.body.lastName,
        email: httpRequest.body.email,
        password: httpRequest.body.password,
        phone: httpRequest.body.phone,
        verificationToken: 'token dumb'
      })
    })

    it('Should return 500 if AddGuardian throws', async () => {
      const { sut, addGuardianStub } = makeSut()
      const httpRequest = makeFakeSignUpRequest()
      jest.spyOn(addGuardianStub, 'add').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(makeFakeServerError())
    })

    it('Should return 403 if AddGuardian returns undefined', async () => {
      const { sut, addGuardianStub } = makeSut()
      const httpRequest = makeFakeSignUpRequest()
      jest.spyOn(addGuardianStub, 'add').mockResolvedValue(undefined)
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(conflict(new ConflictGuardianError()))
    })

    it('Should return 201 if valid data are provide', async () => {
      const { sut } = makeSut()
      const httpRequest = makeFakeSignUpRequest()
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toMatchObject(create({
        firstName: httpRequest.body.firstName,
        lastName: httpRequest.body.lastName,
        email: httpRequest.body.email,
        password: httpRequest.body.password,
        phone: httpRequest.body.phone
      }))
    })
  })
})
