import { ColorValidatorAdapter } from '@/infra/validators'

jest.mock('validator', () => ({
  matches (): boolean {
    return true
  }
}))

const makeSut = (): ColorValidatorAdapter => {
  return new ColorValidatorAdapter()
}

describe('ColorValidator Adapter', () => {
  it('Should return false if validator returns false', async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'isValid').mockReturnValueOnce(false)
    const result = sut.isValid('invalid_color')
    expect(result).toBe(false)
  })
})
