import { InvalidParamError } from '@/application/errors'
import { CompareFieldsValidation } from '@/application/validation'

const makeSut = (): CompareFieldsValidation => {
  const fakeFieldName: string = 'fieldName'
  const fakeFieldToCompareName: string = 'fieldToCompareName'
  const sut = new CompareFieldsValidation(fakeFieldName, fakeFieldToCompareName)
  return sut
}

describe('CompareFieldsValidation', () => {
  it('should return InvalidParamError if fieldName is not equal than FieldToCompareName', () => {
    const sut = makeSut()

    const result = sut.validate({ fieldName: 'fieldName', fieldToCompareName: 'invalid_fieldName' })

    expect(result).toStrictEqual(new InvalidParamError('fieldToCompareName'))
  })
})
