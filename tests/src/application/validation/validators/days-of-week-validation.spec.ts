import { InvalidParamError } from '@/application/errors'
import { DaysOfWeekValidation, type DaysOfWeekValidator } from '@/application/validation'
import { makeFakeDaysOfWeekValidator } from '@/tests/utils'

interface SutTypes {
  sut: DaysOfWeekValidation
  fakeFieldDaysOfWeek: string
  validatorStub: DaysOfWeekValidator
}

const makeSut = (): SutTypes => {
  const fakeFieldDaysOfWeek = 'daysOfWeek'
  const validatorStub = makeFakeDaysOfWeekValidator()
  const sut = new DaysOfWeekValidation(fakeFieldDaysOfWeek, validatorStub)
  return {
    sut,
    fakeFieldDaysOfWeek,
    validatorStub
  }
}

describe('Days Of Week Validation', () => {
  it('Should return InvalidParamError if data in arrays of days is not a number', () => {
    const { sut } = makeSut()
    const isValid = sut.validate([])
    expect(isValid).toEqual(new InvalidParamError('daysOfWeek'))
  })

  it('Should throw if validator throws', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate([0, 4, 6]) }).toThrow()
  })
})
