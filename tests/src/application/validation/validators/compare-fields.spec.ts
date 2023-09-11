import { InvalidParamError } from '@/application/errors'
import { CompareFieldsValidation } from '@/application/validation'

interface SutTypes {
  sut: CompareFieldsValidation
  fakeFieldName: string
  fakeFieldToCompareName: string
}

const makeSut = (): SutTypes => {
  const fakeFieldName: string = 'fieldName'
  const fakeFieldToCompareName: string = 'fieldToCompareName'
  const sut = new CompareFieldsValidation(fakeFieldName, fakeFieldToCompareName)
  return {
    sut,
    fakeFieldName,
    fakeFieldToCompareName
  }
}

describe('CompareFieldsValidation', () => {
  it('should return InvalidParamError if fieldName is not equal than FieldToCompareName', () => {
    const { sut } = makeSut()

    const result = sut.validate({ fieldName: 'fieldName', fieldToCompareName: 'invalid_fieldName' })

    expect(result).toStrictEqual(new InvalidParamError('fieldToCompareName'))
  })

  it('should return Error if customError is provided', () => {
    const { fakeFieldName, fakeFieldToCompareName } = makeSut()
    const fakeCustomError = jest.fn(() => Error())
    const sut = new CompareFieldsValidation(fakeFieldName, fakeFieldToCompareName, fakeCustomError)

    const result = sut.validate({ fieldName: 'fieldName', fieldToCompareName: 'invalid_fieldName' })

    expect(result).toStrictEqual(new Error())
  })

  it('should return void if fieldName is equal FieldToCompareName', () => {
    const { sut } = makeSut()

    const result = sut.validate({ fieldName: 'fieldName', fieldToCompareName: 'fieldName' })

    expect(result).toBeFalsy()
  })
})
