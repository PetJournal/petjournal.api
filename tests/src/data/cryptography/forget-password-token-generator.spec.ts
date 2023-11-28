import { type SaveTokenRepository, type HashGenerator } from '@/data/protocols'
import { ForgetPasswordTokenGenerator } from '@/data/cryptography'
import { makeFakeHashService } from '@/tests/utils'

interface SutTypes {
  sut: ForgetPasswordTokenGenerator
  hashServiceStub: HashGenerator
  saveTokenRepositoryStub: SaveTokenRepository
}

const makeSaveTokenRepository = (): SaveTokenRepository => {
  class SaveTokenRepositoryStub implements SaveTokenRepository {
    async saveToken (params: SaveTokenRepository.Params): Promise<SaveTokenRepository.Result> {
      return await Promise.resolve(true)
    }
  }
  return new SaveTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hashServiceStub = makeFakeHashService()
  const saveTokenRepositoryStub = makeSaveTokenRepository()
  const sut = new ForgetPasswordTokenGenerator(hashServiceStub, saveTokenRepositoryStub)
  return {
    sut,
    hashServiceStub,
    saveTokenRepositoryStub
  }
}

describe('ForgetPasswordTokenGenerator', () => {
  it('Should return a token on success', async () => {
    const { sut } = makeSut()
    const token = await sut.generate('1')
    expect(token).toBeTruthy()
    expect(token).toHaveLength(6)
  })

  it('Should call HashService with correct value', async () => {
    const { sut, hashServiceStub } = makeSut()
    const encryptSpy = jest.spyOn(hashServiceStub, 'encrypt')
    await sut.generate('1')
    expect(encryptSpy).toBeCalled()
  })

  it('Should throw if HashService throws', async () => {
    const { sut, hashServiceStub } = makeSut()
    jest.spyOn(hashServiceStub, 'encrypt').mockReturnValueOnce(Promise.reject(new Error()))
    const promise = sut.generate('1')
    await expect(promise).rejects.toThrow()
  })

  it('Should call SaveTokenRepository with correct values', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    const saveTokenSpy = jest.spyOn(saveTokenRepositoryStub, 'saveToken')
    await sut.generate('1')
    expect(saveTokenSpy).toHaveBeenCalledWith({ userId: '1', token: 'hashed_value' })
  })

  it('Should throw if SaveTokenRepository throws', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    jest.spyOn(saveTokenRepositoryStub, 'saveToken').mockRejectedValueOnce(new Error())
    const promise = sut.generate('1')
    await expect(promise).rejects.toThrow()
  })
})
