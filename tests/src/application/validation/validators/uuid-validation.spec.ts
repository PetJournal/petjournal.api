import { InvalidParamError } from '@/application/errors'
import { UuidValidation, type UuidValidator } from '@/application/validation'
import { makeFakeUuidValidator } from '@/tests/utils'

interface SutTypes {
  sut: UuidValidation
  fakeFieldName: string
  validatorStub: UuidValidator
}

const makeSut = (): SutTypes => {
  const fakeFieldName = 'uuid'
  const validatorStub = makeFakeUuidValidator()
  const sut = new UuidValidation(fakeFieldName, validatorStub)
  return {
    sut,
    fakeFieldName,
    validatorStub
  }
}

describe('Uuid Validation', () => {
  it('Should return InvalidParamError if uuid is not a string', () => {
    const { sut, fakeFieldName } = makeSut()
    const invalidFieldName = 11
    const isValid = sut.validate(invalidFieldName)
    expect(isValid).toEqual(new InvalidParamError(fakeFieldName))
  })
})
