import { NoteValidatorAdapter } from '@/infra/validators'
import validator from 'validator'

const makeSut = (): NoteValidatorAdapter => {
  return new NoteValidatorAdapter()
}

describe('Note Validator Adapter', () => {
  it('Should return false if validation returns false', () => {
    const sut = makeSut()
    jest.spyOn(validator, 'matches').mockReturnValueOnce(false)
    const isValid = sut.isValid('invalid_note')
    expect(isValid).toBe(false)
  })
})
