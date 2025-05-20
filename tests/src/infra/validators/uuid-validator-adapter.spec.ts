import { UuidValidatorAdapter } from '@/infra/validators'
import validator from 'validator'

jest.mock('validator', () => ({
  isUUID: jest.fn(() => true)
}))

const makeSut = (): UuidValidatorAdapter => {
  return new UuidValidatorAdapter()
}

describe('Uuid Validator Adapter', () => {
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'isUUID').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_uuid')
    expect(isValid).toBe(false)
  })

  it('Should return true if validation returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_uuid')
    expect(isValid).toBe(true)
  })
})
