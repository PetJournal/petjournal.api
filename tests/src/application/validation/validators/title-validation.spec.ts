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
})
