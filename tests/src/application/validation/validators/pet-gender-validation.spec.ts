import { InvalidParamError } from '@/application/errors'
import { PetGenderValidation } from '@/application/validation'

interface SutTypes {
  sut: PetGenderValidation
}

const makeSut = (): SutTypes => {
  const fieldName = 'gender'
  const sut = new PetGenderValidation(fieldName)

  return { sut }
}

describe('PetGenderValidation', () => {
  it('Should return InvalidParamError if input is not a string', () => {
    const { sut } = makeSut()
    const input = 1
    const result = sut.validate(input)
    expect(result).toEqual(new InvalidParamError('gender'))
  })

  it("Should return InvalidParamError if input is not 'M' or 'F'", () => {
    const { sut } = makeSut()
    const input = 'any_input'
    const result = sut.validate(input)
    expect(result).toEqual(new InvalidParamError('gender'))
  })
})
