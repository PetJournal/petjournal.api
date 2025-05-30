import { InvalidParamError } from '@/application/errors'
import { DaysOfMonthValidation, type DaysOfMonthValidator } from '@/application/validation'
import { makeFakeDaysOfMonthValidator } from '@/tests/utils'

interface SutTypes {
  sut: DaysOfMonthValidation
  fakeDaysOfMonthField: string
  validatorStub: DaysOfMonthValidator
}

const makeSut = (): SutTypes => {
  const fakeDaysOfMonthField = 'daysOfMonth'
  const validatorStub = makeFakeDaysOfMonthValidator()
  const sut = new DaysOfMonthValidation(fakeDaysOfMonthField, validatorStub)
  return {
    sut,
    fakeDaysOfMonthField,
    validatorStub
  }
}

describe('DaysOfMonth Validation', () => {
  it('Should return InvalidParamError if a invalid array of days is provided', () => {
    const { sut, fakeDaysOfMonthField } = makeSut()
    const isValid = sut.validate({ daysOfMonth: [] })
    expect(isValid).toEqual(new InvalidParamError(fakeDaysOfMonthField))
  })

  it('Should throw if validator throws', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate({ daysOfMonth: [0, 4, 6] }) }).toThrow()
  })

  it('Should call validator with correct values', () => {
    const { sut, validatorStub } = makeSut()
    const validatorSpy = jest.spyOn(validatorStub, 'isValid')
    sut.validate({ daysOfMonth: [0] })
    expect(validatorSpy).toHaveBeenCalledWith([0])
  })

  it('Should return InvalidParamError if validator returns false', () => {
    const { sut, fakeDaysOfMonthField, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockReturnValueOnce(false)
    const isValid = sut.validate({ daysOfMonth: [0, 4, 50] })
    expect(isValid).toEqual(new InvalidParamError(fakeDaysOfMonthField))
  })

  it('Should return void if array of days is valid', () => {
    const { sut } = makeSut()
    const isValid = sut.validate({ daysOfMonth: [1, 4, 31] })
    expect(isValid).toBeFalsy()
  })
})
