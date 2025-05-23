import { InvalidParamError } from '@/application/errors'
import { type DateValidator, EndAtValidation } from '@/application/validation'
import { makeFakeDateValidator } from '@/tests/utils'

interface SutTypes {
  sut: EndAtValidation
  fakeEndAtField: string
  validatorStub: DateValidator
}

const makeSut = (): SutTypes => {
  const fakeEndAtField = 'endAt'
  const validatorStub = makeFakeDateValidator()
  const sut = new EndAtValidation(fakeEndAtField, validatorStub)
  return {
    sut,
    fakeEndAtField,
    validatorStub
  }
}

describe('EndAt Validation', () => {
  it('Should return InvalidParamError if endAt is not a string', () => {
    const { sut, fakeEndAtField } = makeSut()
    const invalidEndAtField = 11
    const isValid = sut.validate(invalidEndAtField)
    expect(isValid).toEqual(new InvalidParamError(fakeEndAtField))
  })
})
