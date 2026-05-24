import { BreedValidatorAdapter } from '@/infra/validators'
import validator from 'validator'

jest.mock('validator', () => ({
  matches (): boolean {
    return true
  }
}))

const makeSut = (): BreedValidatorAdapter => {
  return new BreedValidatorAdapter()
}

describe('Breed Validator Adapter', () => {
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'matches').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_breed')
    expect(isValid).toBe(false)
  })

  it('Should return true if validation returns true', () => {
    const sut = makeSut()
    const isValid = sut.isValid('valid_breed')
    expect(isValid).toBe(true)
  })

  it('Should call validator with correct breed', () => {
    const sut = makeSut()
    const regexBreed = /^[a-zA-ZáàâãéèêíïóôõöúçñÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ ]{3,}$/
    const matchesBreedSpy = jest.spyOn(validator, 'matches')
    sut.isValid('valid_breed')
    expect(matchesBreedSpy).toHaveBeenCalledWith('valid_breed', regexBreed)
  })
})
