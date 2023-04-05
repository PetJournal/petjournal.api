import { NameValidatorAdapter } from '../../src/application/validation/validators'
import validator from 'validator'

jest.mock('validator', () => ({
  matches (): boolean {
    return true
  }
}))

const makeSut = (): NameValidatorAdapter => {
  return new NameValidatorAdapter()
}

describe('NameValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'matches').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_first_name', 'invalid_last_name')
    expect(isValid).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_first_name', 'valid_last_name')
    expect(isValid).toBe(true)
  })

  it('Should call validator with correct name', () => {
    const sut = makeSut()
    const regexName = /^[a-zA-Z]{3,}$/
    const matchesNameSpy = jest.spyOn(validator, 'matches')
    sut.isValid('valid_first_name', 'valid_last_name')
    expect(matchesNameSpy).toBeCalledWith('valid_first_name', regexName)
    expect(matchesNameSpy).toBeCalledWith('valid_last_name', regexName)
  })
})
