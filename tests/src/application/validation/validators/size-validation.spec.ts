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
    invalid: { size: 'invalid_size' }
  }
  test('should resturn InvalidParamError if size is not a valid size', () => {
    const { sut, sizeValidatorStub, fakeSize } = makeSut()
    jest.spyOn(sizeValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate(params.invalid)
    expect(result).toStrictEqual(new InvalidParamError(fakeSize))
  })
})
