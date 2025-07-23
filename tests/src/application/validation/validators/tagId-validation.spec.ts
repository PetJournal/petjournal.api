import { TagIdValidation } from '@/application/validation'
import { InvalidParamError } from '@/application/errors'
import { type UuidValidator } from '@/application/validation/protocols'

interface SutTypes {
  sut: TagIdValidation
  uuidValidator: UuidValidator
  fieldName: string
}

const makeUuidValidator = (): UuidValidator => {
  return {
    isValid: jest.fn()
  }
}

const makeSut = (): SutTypes => {
  const fieldName = 'tagId'
  const uuidValidator = makeUuidValidator()
  const sut = new TagIdValidation(fieldName, uuidValidator)

  return {
    sut,
    uuidValidator,
    fieldName
  }
}

describe('TagIdValidation', () => {
  it('Should return an InvalidParamError if validator returns false', () => {
    const { sut, uuidValidator, fieldName } = makeSut()
    jest.spyOn(uuidValidator, 'isValid').mockReturnValueOnce(false)

    const result = sut.validate({ tagId: 'invalid-uuid' })

    expect(result).toEqual(new InvalidParamError(fieldName))
  })

  it('Should not return error if validator returns true', () => {
    const { sut, uuidValidator } = makeSut()
    jest.spyOn(uuidValidator, 'isValid').mockReturnValueOnce(true)

    const result = sut.validate({ tagId: 'valid-uuid' })

    expect(result).toBeUndefined()
  })

  it('Should call UuidValidator with correct value', () => {
    const { sut, uuidValidator } = makeSut()
    const isValidSpy = jest.spyOn(uuidValidator, 'isValid')

    const input = { tagId: 'any-id' }
    sut.validate(input)

    expect(isValidSpy).toHaveBeenCalledWith('any-id')
  })

  it('Should return undefined if tagId is undefined', () => {
    const { sut } = makeSut()
    const result = sut.validate({})
    expect(result).toBeUndefined()
  })

  it('Should return undefined if tagId is null', () => {
    const { sut } = makeSut()
    const result = sut.validate({ tagId: null })
    expect(result).toBeUndefined()
  })

  it('Should return InvalidParamError if tagId is not a string', () => {
    const { sut } = makeSut()
    const result = sut.validate({ tagId: 123 })
    expect(result).toEqual(new InvalidParamError('tagId'))
  })
})
