import { InvalidParamError } from '@/application/errors'
import { SizeValidation, type SizeValidator } from '@/application/validation'
import { makeFakeSizeValidator } from '@/tests/utils'

interface SutTypes {
  sut: SizeValidation
  sizeValidatorStub: SizeValidator
  fakeSize: string
}

const makeSut = (): SutTypes => {
  const fakeSize: string = 'size'
  const sizeValidatorStub = makeFakeSizeValidator()
  const sut = new SizeValidation(fakeSize, sizeValidatorStub)
  return {
    sut,
    sizeValidatorStub,
    fakeSize
  }
}

describe('SizeValidation', () => {
  const params = {
    invalid: { size: 'invalid_size' },
    valid: { size: 'valid_size' }
  }
  test('should resturn InvalidParamError if size is not a valid size', () => {
    const { sut, sizeValidatorStub, fakeSize } = makeSut()
    jest.spyOn(sizeValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate(params.invalid)
    expect(result).toStrictEqual(new InvalidParamError(fakeSize))
  })

  test('should throw if validator throws', () => {
    const { sut, sizeValidatorStub } = makeSut()
    jest.spyOn(sizeValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate(params.valid) })
  })

  test('should call validator with correct argument', () => {
    const { sut, sizeValidatorStub } = makeSut()
    const spyValidator = jest.spyOn(sizeValidatorStub, 'isValid')
    sut.validate(params.valid)
    expect(spyValidator).toHaveBeenCalledWith('valid_size')
  })
})
