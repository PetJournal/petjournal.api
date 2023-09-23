import { InvalidParamError } from '@/application/errors'
import { PhoneValidation, type PhoneValidator } from '@/application/validation'
import { makeFakePhoneValidator } from '@/tests/utils'

interface SutTypes {
  sut: PhoneValidation
  phoneValidatorStub: PhoneValidator
}

const makesut = (): SutTypes => {
  const fakeFieldName: string = 'fieldName'
  const phoneValidatorStub = makeFakePhoneValidator()
  const sut = new PhoneValidation(fakeFieldName, phoneValidatorStub)
  return {
    sut,
    phoneValidatorStub
  }
}

describe('PhoneValidation', () => {
  const params = {
    valid: { fieldName: 'valid_phone' },
    invalid: { fieldName: 'invalid_phone' },
    notStringValue: { fieldName: 11 }
  }

  describe('PhoneValidator', () => {
    it('should return InvalidParamError if fieldName is not a valid phone', () => {
      const { sut, phoneValidatorStub } = makesut()
      jest.spyOn(phoneValidatorStub, 'isValid').mockReturnValueOnce(false)

      const result = sut.validate(params.invalid)

      expect(result).toStrictEqual(new InvalidParamError('fieldName'))
    })

    it('should throw if validator throws', () => {
      const { sut, phoneValidatorStub } = makesut()
      jest.spyOn(phoneValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

      expect(() => { sut.validate(params.valid) }).toThrow()
    })

    it('should call validator with a correct argument', () => {
      const { sut, phoneValidatorStub } = makesut()
      const isValidSpy = jest.spyOn(phoneValidatorStub, 'isValid')

      sut.validate(params.valid)

      expect(isValidSpy).toBeCalledWith('valid_phone')
    })
  })

  it('should returns InvalidParamError if fieldName is not a string', () => {
    const { sut } = makesut()

    const result = sut.validate(params.notStringValue)

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should return void if fieldName is a valid phone', () => {
    const { sut } = makesut()

    const result = sut.validate(params.valid)

    expect(result).toBeFalsy()
  })
})
