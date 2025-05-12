import { InvalidParamError } from '@/application/errors'
import { ColorValidation, type ColorValidator } from '@/application/validation'
import { makeFakeColorValidator } from '@/tests/utils'

interface SutTypes {
  sut: ColorValidation
  colorValidatorStub: ColorValidator
}

const makeSut = (): SutTypes => {
  const colorField: string = 'color'
  const colorValidatorStub = makeFakeColorValidator()
  const sut = new ColorValidation(colorField, colorValidatorStub)
  return {
    sut,
    colorValidatorStub
  }
}

describe('ColorValidation', () => {
  it('Should return InvalidParamError if color is not a valid color', () => {
    const { sut, colorValidatorStub } = makeSut()
    jest.spyOn(colorValidatorStub, 'isValid').mockReturnValueOnce(false)
    const result = sut.validate({ color: 'any_color' })
    expect(result).toEqual(new InvalidParamError('color'))
  })

  it('Should throw if validator throws', () => {
    const { sut, colorValidatorStub } = makeSut()
    jest.spyOn(colorValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate({ color: 'any_color' }) }).toThrow()
  })

  it('Should call validator with correct argument', () => {
    const { sut, colorValidatorStub } = makeSut()
    const colorValidatorSpy = jest.spyOn(colorValidatorStub, 'isValid')
    sut.validate({ color: 'any_color' })
    expect(colorValidatorSpy).toHaveBeenCalledWith('any_color')
  })
})
