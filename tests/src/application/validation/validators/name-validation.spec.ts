import { InvalidParamError } from '@/application/errors'
import { NameValidation, type NameValidator } from '@/application/validation'

class NameValidatorStub implements NameValidator {
  isValid (name: string): boolean {
    return true
  }
}

const makeSut = (): NameValidation => {
  const fakeFieldName: string = 'fieldName'
  const nameValidatorStub = new NameValidatorStub()
  const sut = new NameValidation(fakeFieldName, nameValidatorStub)
  return sut
}

describe('NameValidation', () => {
  it('should returns invalidParamError if fieldName is not a string', () => {
    const sut = makeSut()

    const result = sut.validate({ fieldName: 11 })

    expect(result).toStrictEqual(new InvalidParamError('fieldName'))
  })
})
