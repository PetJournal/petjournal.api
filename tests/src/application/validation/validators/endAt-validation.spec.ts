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
  const fakeStartAtField = 'startAt'
  const validatorStub = makeFakeDateValidator()
  const sut = new EndAtValidation(fakeEndAtField, fakeStartAtField, validatorStub)
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

  it('Should throw if validator throws', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate({ endAt: 'any_date' }) }).toThrow()
  })

  it('Should call validator with correct values', () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'isValid')
    sut.validate({ startAt: 'any_start_date', endAt: 'any_end_date' })
    expect(validatorSpy).toHaveBeenCalledWith('any_start_date', 'any_end_date')
  })

  it('Should return InvalidParamError if EndAt is not a date', () => {
    const { sut, fakeEndAtField, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockReturnValueOnce(false)
    const isValid = sut.validate({ endAt: 'any_date' })
    expect(isValid).toEqual(new InvalidParamError(fakeEndAtField))
  })

  it('Should return void if EndAt is valid', () => {
    const { sut } = makeSut()
    const isValid = sut.validate({ endAt: 'any_date' })
    expect(isValid).toBeFalsy()
  })
})
