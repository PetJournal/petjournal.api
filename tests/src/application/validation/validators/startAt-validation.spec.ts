import { InvalidParamError } from '@/application/errors'
import { type DateValidator, StartAtValidation } from '@/application/validation'
import { makeFakeDateValidator } from '@/tests/utils'

interface SutTypes {
  sut: StartAtValidation
  fakeStartField: string
  validatorStub: DateValidator
}

const makeSut = (): SutTypes => {
  const fakeStartField = 'startAt'
  const validatorStub = makeFakeDateValidator()
  const sut = new StartAtValidation(fakeStartField, validatorStub)
  return {
    sut,
    fakeStartField,
    validatorStub
  }
}

describe('StartAt Validation', () => {
  it('Should return InvalidParamError if fieldStartAt is not a string', () => {
    const { sut, fakeStartField } = makeSut()
    const invalidStartAtField = 11
    const isValid = sut.validate(invalidStartAtField)
    expect(isValid).toEqual(new InvalidParamError(fakeStartField))
  })

  it('Should throw if validator throws', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate({ startAt: 'any_date' }) }).toThrow()
  })
})
