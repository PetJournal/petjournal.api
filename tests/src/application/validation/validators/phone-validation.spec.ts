import { InvalidParamError } from '@/application/errors'
import { PhoneValidation, type PhoneValidator } from '@/application/validation'

const makePhoneValidatorStub = (): PhoneValidator => {
  class PhoneValidatorStub implements PhoneValidator {
    isValid (phone: string): boolean {
      return true
    }
  }
  return new PhoneValidatorStub()
}

interface SutTypes {
  sut: PhoneValidation
  phoneValidatorStub: PhoneValidator
}

const makesut = (): SutTypes => {
  const fakeFieldName: string = 'fieldName'
  const phoneValidatorStub = makePhoneValidatorStub()
  const sut = new PhoneValidation(fakeFieldName, phoneValidatorStub)
  return {
    sut,
    phoneValidatorStub
  }
}

describe('PhoneValidation', () => {
  it('should returns InvalidParamError if fieldName is not a string', () => {
    const { sut } = makesut()

    const result = sut.validate({ fieldName: 11 })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should return InvalidParamError if fieldName is not a valid phone', () => {
    const { sut, phoneValidatorStub } = makesut()
    jest.spyOn(phoneValidatorStub, 'isValid').mockReturnValueOnce(false)

    const result = sut.validate({ fieldName: 'invalid_phone' })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })

  it('should throw if validator throws', () => {
    const { sut, phoneValidatorStub } = makesut()
    jest.spyOn(phoneValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })

    expect(() => { sut.validate({ fieldName: 'valid_phone' }) }).toThrow()
  })

  it('should call validator with a correct argument', () => {
    const { sut, phoneValidatorStub } = makesut()
    const isValidSpy = jest.spyOn(phoneValidatorStub, 'isValid')

    sut.validate({ fieldName: 'valid_phone' })

    expect(isValidSpy).toBeCalledWith('valid_phone')
  })

  it('should return void if fieldName is a valid phone', () => {
    const { sut } = makesut()

    const result = sut.validate({ fieldName: 'valid_phone' })

    expect(result).toBeFalsy()
  })
})
