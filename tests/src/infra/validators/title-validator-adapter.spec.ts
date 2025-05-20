import { TitleValidatorAdapter } from '@/infra/validators'
import validator from 'validator'

jest.mock('validator', () => ({
  matches: jest.fn(() => true)
}))

const makeSut = (): TitleValidatorAdapter => {
  return new TitleValidatorAdapter()
}

describe('Title Validator Adapter', () => {
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'matches').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_title')
    expect(isValid).toBe(false)
  })
})
