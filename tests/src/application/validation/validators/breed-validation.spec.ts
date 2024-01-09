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
  const params = {
    valid: { fieldName: 'valid_breedName' },
    invalid: { fieldName: 'invalid_breedName' },
    notStringValue: { fieldName: 11 }
  }
  test('should return InvalidParamError if breedName is not a valid breed', () => {
    const { sut, fakeBreedName, breedValidatorStub } = makeSut()
    jest.spyOn(breedValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate(params.invalid)
    expect(result).toStrictEqual(new InvalidParamError(fakeBreedName))
  })

  test('should throw if validator throws', () => {
    const { sut, breedValidatorStub } = makeSut()
    jest.spyOn(breedValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate(params.valid) }).toThrow()
  })

  test('should call validator with correct argument', () => {
    const { sut, breedValidatorStub } = makeSut()
    const spyValidator = jest.spyOn(breedValidatorStub, 'isValid')
    sut.validate(params.valid)
    expect(spyValidator).toHaveBeenCalledWith('valid_breedName')
  })
})
