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
  const fakeBreedName: string = 'breedName'
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
    valid: { breedName: 'valid_breedName' },
    invalid: { breedName: 'invalid_breedName' },
    notStringValue: { breedName: 11 }
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

  test('should return InvalidParamError if breedName is not a string', () => {
    const { sut, fakeBreedName, breedValidatorStub } = makeSut()
    jest.spyOn(breedValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate(params.valid)
    expect(result).toStrictEqual(new InvalidParamError(fakeBreedName))
  })
})
