import { MissingParamError } from '@/application/errors'
import { RequiredFieldValidation } from '@/application/validation'

const makeSut = (): RequiredFieldValidation => {
  const fakeFieldName: string = 'fieldName'
  const sut = new RequiredFieldValidation(fakeFieldName)
  return sut
}

describe('RequiredFieldValidation', () => {
  it('should return MissingParamError if fieldName is not provided', () => {
    const sut = makeSut()

    const result = sut.validate({ fieldName: '' })

    expect(result).toStrictEqual(new MissingParamError('fieldName'))
  })

  it('should return void if fieldName is provided', () => {
    const sut = makeSut()

    const result = sut.validate({ fieldName: 'fieldName' })

    expect(result).toBeFalsy()
  })
})
