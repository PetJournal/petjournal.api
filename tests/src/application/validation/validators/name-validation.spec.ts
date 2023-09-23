import { InvalidParamError } from '@/application/errors'
import { NameValidation, type NameValidator } from '@/application/validation'
import { makeFakeNameValidator } from '@/tests/utils'

interface SutTypes {
  sut: NameValidation
  nameValidatorStub: NameValidator
}

const makeSut = (): SutTypes => {
  const fakeFieldName: string = 'fieldName'
  const nameValidatorStub = makeFakeNameValidator()
  const sut = new NameValidation(fakeFieldName, nameValidatorStub)
  return {
    sut,
    nameValidatorStub
  }
}

describe('NameValidation', () => {
  const params = {
    valid: { fieldName: 'valid_name' },
    invalid: { fieldName: 'invalid_name' },
    notStringValue: { fieldName: 11 }
  }
  describe('NameValidator', () => {
    it('should return InvalidParamError if fieldName is not a valid name', () => {
      const { sut, nameValidatorStub } = makeSut()
      jest.spyOn(nameValidatorStub, 'isValid').mockReturnValueOnce(false)

      const result = sut.validate(params.invalid)

      expect(result).toStrictEqual(new InvalidParamError('fieldName'))
    })

    it('should throw if validator throws', () => {
      const { sut, nameValidatorStub } = makeSut()
      jest.spyOn(nameValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

      expect(() => { sut.validate(params.valid) }).toThrow()
    })

    it('should call validator with correct argument', () => {
      const { sut, nameValidatorStub } = makeSut()
      const isValidSpy = jest.spyOn(nameValidatorStub, 'isValid')

      sut.validate(params.valid)

      expect(isValidSpy).toHaveBeenCalledWith('valid_name')
    })
  })

  it('should returns invalidParamError if fieldName is not a string', () => {
    const { sut } = makeSut()

    const result = sut.validate(params.notStringValue)

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should return void if fieldName is a valid name', () => {
    const { sut } = makeSut()

    const result = sut.validate(params.valid)

    expect(result).toBeFalsy()
  })
})
