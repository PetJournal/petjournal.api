import { InvalidParamError } from '@/application/errors'
import { DateValidation, type DateValidator } from '@/application/validation'

interface SutTypes {
  sut: DateValidation
  dateValidatorStub: DateValidator
}

const makeFakeDateValidator = (): DateValidator => {
  class DateValidatorStub implements DateValidator {
    isValid (date: string): boolean {
      return true
    }
  }
  return new DateValidatorStub()
}

const makeSut = (): SutTypes => {
  const dateValidatorStub = makeFakeDateValidator()
  const sut = new DateValidation('date', dateValidatorStub)
  return {
    sut,
    dateValidatorStub
  }
}

describe('DateValidation', () => {
  it('Should return an InvalidParamError if date is not a string', () => {
    const { sut } = makeSut()
    const error = sut.validate({ date: 1 })
    expect(error).toEqual(new InvalidParamError('date'))
  })

  it('Should call validator with correct value', () => {
    const { sut, dateValidatorStub } = makeSut()
    const validSpy = jest.spyOn(dateValidatorStub, 'isValid')
    sut.validate({ date: 'valid_date' })
    expect(validSpy).toHaveBeenCalledWith('valid_date')
  })

  it('Should throw if validator throws', () => {
    const { sut, dateValidatorStub } = makeSut()
    jest.spyOn(dateValidatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate({ date: 'valid_date' }) }).toThrow()
  })

  it('Should return InvalidParamError if validator returns false', () => {
    const { sut, dateValidatorStub } = makeSut()
    jest.spyOn(dateValidatorStub, 'isValid').mockReturnValueOnce(false)
    const error = sut.validate({ date: 'invalid_date' })
    expect(error).toEqual(new InvalidParamError('date'))
  })

  it('Should return void if validator returns true', () => {
    const { sut } = makeSut()
    const error = sut.validate({ date: 'valid_date' })
    expect(error).toBeFalsy()
  })
})
