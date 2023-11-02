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

interface FakeInput {
  gender: any
}

const makeFakeInput = (data: any): FakeInput => ({
  gender: data
})

describe('PetGenderValidation', () => {
  it('Should return InvalidParamError if input is not a string', () => {
    const { sut } = makeSut()
    const result = sut.validate(makeFakeInput(1))
    expect(result).toEqual(new InvalidParamError('gender'))
  })

  it("Should return InvalidParamError if input is not 'M' or 'F'", () => {
    const { sut } = makeSut()
    const result = sut.validate(makeFakeInput('any_input'))
    expect(result).toEqual(new InvalidParamError('gender'))
  })

  it("Should return void if input is 'M'", () => {
    const { sut } = makeSut()
    const result = sut.validate(makeFakeInput('M'))
    expect(result).toBeFalsy()
  })

  it("Should return void if input is 'F'", () => {
    const { sut } = makeSut()
    const result = sut.validate(makeFakeInput('F'))
    expect(result).toBeFalsy()
  })
})
