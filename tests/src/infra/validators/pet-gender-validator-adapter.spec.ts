import { PetGenderValidatorAdapter } from '@/infra/validators'

const makeSut = (): PetGenderValidatorAdapter => {
  return new PetGenderValidatorAdapter()
}

describe('PetGender Validator Adapter', () => {
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    const isValid = sut.isValid({ gender: 'invalid_gender' }, 'gender')
    expect(isValid).toBe(false)
  })

  it('Should return true if validation returns true', () => {
    const input = {
      gender: 'M'
    }
    const sut = makeSut()
    const isValid = sut.isValid(input, 'gender')
    expect(isValid).toBe(true)
  })
})
