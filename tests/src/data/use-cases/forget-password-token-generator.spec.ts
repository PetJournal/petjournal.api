import { ForgetPasswordTokenGenerator } from '@/data/use-cases/forget-password-token-generation'
import { type SaveTokenRepository, type HashGenerator } from '@/data/protocols'
import { makeHashService } from '@/tests/utils'

interface SutTypes {
  sut: ForgetPasswordTokenGenerator
  hashServiceStub: HashGenerator
  saveTokenRepositoryStub: SaveTokenRepository
}

const makeSaveTokenRepository = (): SaveTokenRepository => {
  class SaveTokenRepositoryStub implements SaveTokenRepository {
    async saveToken (userId: string, token: string): Promise<SaveTokenRepository.Result> {
      return await new Promise(resolve => { resolve(true) })
    }
  }
  return new SaveTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const hashServiceStub = makeHashService()
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

  it('Should call Encrypter with correct value', async () => {
    const { sut, hashServiceStub } = makeSut()
    const encryptSpy = jest.spyOn(hashServiceStub, 'encrypt')
    await sut.generate('1')
    expect(encryptSpy).toBeCalled()
  })

  it('Should throw if Encrypter throws', async () => {
    const { sut, hashServiceStub } = makeSut()
    jest.spyOn(hashServiceStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.generate('1')
    await expect(promise).rejects.toThrow()
  })

  it('Should call SaveTokenRepository with correct values', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    const saveTokenSpy = jest.spyOn(saveTokenRepositoryStub, 'saveToken')
    await sut.generate('1')
    expect(saveTokenSpy).toHaveBeenCalledWith('1', 'hashed_value')
  })

  it('Should throw if SaveTokenRepository throws', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    jest.spyOn(saveTokenRepositoryStub, 'saveToken').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.generate('1')
    await expect(promise).rejects.toThrow()
  })
})
