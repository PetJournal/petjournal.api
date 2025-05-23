import { InvalidParamError } from '@/application/errors'
import { NoteValidation, type NoteValidator } from '@/application/validation'
import { makeFakeNoteValidator } from '@/tests/utils'

interface SutTypes {
  sut: NoteValidation
  fakeFieldNote: string
  validatorStub: NoteValidator
}

const makeSut = (): SutTypes => {
  const fakeFieldNote = 'note'
  const validatorStub = makeFakeNoteValidator()
  const sut = new NoteValidation(fakeFieldNote, validatorStub)
  return {
    sut,
    fakeFieldNote,
    validatorStub
  }
}

describe('Note Validation', () => {
  it('Should return InvalidParamError if note is not a string', () => {
    const { sut, fakeFieldNote } = makeSut()
    const invalidFieldNote = 11
    const isValid = sut.validate(invalidFieldNote)
    expect(isValid).toEqual(new InvalidParamError(fakeFieldNote))
  })

  it('Should throw if validator throws', () => {
    const { sut, validatorStub } = makeSut()
    jest.spyOn(validatorStub, 'isValid').mockImplementationOnce(() => { throw new Error() })
    expect(() => { sut.validate({ note: 'any_note' }) }).toThrow()
  })
})
