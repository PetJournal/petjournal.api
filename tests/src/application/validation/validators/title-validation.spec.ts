import { InvalidParamError } from '@/application/errors'
import { TitleValidation, type TitleValidator } from '@/application/validation'
import { makeFakeTitleValidator } from '@/tests/utils'

interface SutTypes {
  sut: TitleValidation
  fakeFieldTitle: string
  validatorStub: TitleValidator
}

const makeSut = (): SutTypes => {
  const fakeFieldTitle = 'title'
  const validatorStub = makeFakeTitleValidator()
  const sut = new TitleValidation(fakeFieldTitle, validatorStub)
  return {
    sut,
    fakeFieldTitle,
    validatorStub
  }
}

describe('Title Validation', () => {
  it('Should return InvalidParamError if title is not a string', () => {
    const { sut } = makeSut()
    const invalidFieldTitle = 11
    const isValid = sut.validate(invalidFieldTitle)
    expect(isValid).toEqual(new InvalidParamError('title'))
  })

  it('Should throw if validator throws', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate({ title: 'any_title' }) }).toThrow()
  })

  it('Should call validator with correct values', () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'isValid')
    sut.validate({ title: 'any_title' })
    expect(validatorSpy).toHaveBeenCalledWith('any_title')
  })

  it('Should return InvalidParamError if title is not valid', () => {
    const { sut, fakeFieldTitle, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockReturnValueOnce(false)
    const isValid = sut.validate({ title: 'any_title' })
    expect(isValid).toEqual(new InvalidParamError(fakeFieldTitle))
  })

  it('Should return void if title is valid', () => {
    const { sut } = makeSut()
    const isValid = sut.validate({ title: 'any_title' })
    expect(isValid).toBeFalsy()
  })
})
