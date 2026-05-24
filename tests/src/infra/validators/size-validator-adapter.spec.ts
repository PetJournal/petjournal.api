import { SizeValidatorAdapter } from '@/infra/validators'
import validator from 'validator'

jest.mock('validator', () => ({
  matches (): boolean {
    return true
  }
}))

const makeSut = (): SizeValidatorAdapter => {
  return new SizeValidatorAdapter()
}

describe('Size Validator Adapter', () => {
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'matches').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_size')
    expect(isValid).toBe(false)
  })

  it('Should return true if validation returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_size')
    expect(isValid).toBe(true)
  })

  it('Should call validator with correct size', () => {
    const sut = makeSut()
    const regexSize = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ()]/
    const matchesSizeSpy = jest.spyOn(validator, 'matches')
    sut.isValid('valid_size')
    expect(matchesSizeSpy).toHaveBeenCalledWith('valid_size', regexSize)
  })
})
