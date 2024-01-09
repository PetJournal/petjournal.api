import { InvalidParamError } from '@/application/errors'
import { type BreedValidator } from '@/application/validation/protocols/breed-validator'
import { BreedValidation } from '@/application/validation/validators/breed-validation'
import { makeFakeBreedValidator } from '@/tests/utils'

interface SutTypes {
  sut: BreedValidation
  breedValidatorStub: BreedValidator
  fakeBreedName: string
}

const makeSut = (): SutTypes => {
  const fakeBreedName: string = 'fieldName'
  const breedValidatorStub = makeFakeBreedValidator()
  const sut = new BreedValidation(fakeBreedName, breedValidatorStub)
  return {
    sut,
    breedValidatorStub,
    fakeBreedName
  }
}
describe('BreedValidation', () => {
  test('should return InvalidParamError if breedName is not a valid breed', () => {
    const { sut, fakeBreedName, breedValidatorStub } = makeSut()
    jest.spyOn(breedValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate({ breedName: 'invalid_breedName' })
    expect(result).toStrictEqual(new InvalidParamError(fakeBreedName))
  })
})
