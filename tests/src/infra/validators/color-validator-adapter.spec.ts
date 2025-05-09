import { ColorValidatorAdapter } from '@/infra/validators'

jest.mock('validator', () => ({
  isHexColor: jest.fn(() => true)
}))

const makeSut = (): ColorValidatorAdapter => {
  return new ColorValidatorAdapter()
}

describe('ColorValidator Adapter', () => {
  it('Should return false if validator returns false', () => {
    const sut = makeSut()
    jest.spyOn(sut, 'isValid').mockReturnValueOnce(false)
    const result = sut.isValid('invalid_color')
    expect(result).toBe(false)
  })

  it('Should return true if validator returns true', () => {
    const sut = makeSut()
    const result = sut.isValid('valid_color')
    expect(result).toBe(true)
  })
})
