import { MissingParamError } from '@/application/errors'
import { RequiredFieldValidation } from '@/application/validation'

const makeSut = (): RequiredFieldValidation => {
  const fakeFieldName: string = 'fieldName'
  const sut = new RequiredFieldValidation(fakeFieldName)
  return sut
}

describe('RequiredFieldValidation', () => {
  const params = {
    validFieldName: { fieldName: 'fieldName' },
    emptyInput: {}
  }

  it('should return MissingParamError if input is not provided', () => {
    const sut = makeSut()

    const result = sut.validate(params.emptyInput)

    expect(result).toStrictEqual(new MissingParamError('fieldName'))
  })

  it('should return void if fieldName is provided', () => {
    const sut = makeSut()

    const result = sut.validate(params.validFieldName)

    expect(result).toBeFalsy()
  })
})
