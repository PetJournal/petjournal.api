import { InvalidParamError } from '@/application/errors'
import { DescriptionValidation, type DescriptionValidator } from '@/application/validation'
import { makeFakeDescriptionValidator } from '@/tests/utils'

interface SutTypes {
  sut: DescriptionValidation
  fakeFieldDescription: string
  validatorStub: DescriptionValidator
}

const makeSut = (): SutTypes => {
  const fakeFieldDescription = 'description'
  const validatorStub = makeFakeDescriptionValidator()
  const sut = new DescriptionValidation(fakeFieldDescription, validatorStub)
  return {
    sut,
    fakeFieldDescription,
    validatorStub
  }
}

describe('Description Validation', () => {
  it('Should return InvalidParamError if description is not a string', () => {
    const { sut, fakeFieldDescription } = makeSut()
    const invalidDescriptionField = 11
    const isValid = sut.validate(invalidDescriptionField)
    expect(isValid).toEqual(new InvalidParamError(fakeFieldDescription))
  })
})
