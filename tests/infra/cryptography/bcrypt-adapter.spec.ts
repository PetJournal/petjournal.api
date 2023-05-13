import bcrypt from 'bcrypt'
import { BcryptAdapter } from '@/infra/cryptography/bcrypt-adapter'
import { type HashComparer } from '@/data/protocols'

jest.mock('bcrypt', () => ({
  async hash (): Promise<string> {
    return await new Promise(resolve => { resolve('hash') })
  },

  async compare (): Promise<boolean> {
    return await new Promise(resolve => { resolve(true) })
  }
}))

const throwError = (): never => {
  throw new Error()
}

const makeFakeHashCompare = (): HashComparer.Params => ({
  value: 'any_value', hash: 'any_hash'
})

const salt = 12
const makeSut = (): BcryptAdapter => {
  return new BcryptAdapter(salt)
}

describe('Bcrypt Adapter', () => {
  it('Should call bcrypt with correct values', async () => {
    const sut = makeSut()
    const hashSpy = jest.spyOn(bcrypt, 'hash')
    await sut.encrypt({ value: 'any_value' })
    expect(hashSpy).toHaveBeenCalledWith('any_value', salt)
  })

  it('Should return a valid hash on hash success', async () => {
    const sut = makeSut()
    const hash = await sut.encrypt({ value: 'any_value' })
    expect(hash).toBe('hash')
  })

  it('Should throw if hash throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'hash').mockImplementationOnce(throwError)
    const promise = sut.encrypt({ value: 'any_value' })
    await expect(promise).rejects.toThrow()
  })

  it('Should call compare with correct values', async () => {
    const sut = makeSut()
    const compareSpy = jest.spyOn(bcrypt, 'compare')
    await sut.compare(makeFakeHashCompare())
    expect(compareSpy).toHaveBeenCalledWith('any_value', 'any_hash')
  })

  it('Should return true when compare succeeds', async () => {
    const sut = makeSut()
    const isValid = await sut.compare(makeFakeHashCompare())
    expect(isValid).toBe(true)
  })

  it('Should return false when compare fails', async () => {
    const sut = makeSut()
    jest.spyOn(sut, 'compare').mockReturnValueOnce(new Promise(resolve => { resolve(false) }))
    const isValid = await sut.compare(makeFakeHashCompare())
    expect(isValid).toBe(false)
  })

  it('Should throw if compare throws', async () => {
    const sut = makeSut()
    jest.spyOn(bcrypt, 'compare').mockImplementationOnce(throwError)
    const promise = sut.compare(makeFakeHashCompare())
    await expect(promise).rejects.toThrow()
  })
})
