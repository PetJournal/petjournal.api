import { DbSaveToken } from '@/data/use-cases'
import { type SaveTokenRepository } from '@/data/protocols'

interface SutTypes {
  sut: DbSaveToken
  saveTokenRepositoryStub: SaveTokenRepository
}

const makeSaveTokenRepository = (): SaveTokenRepository => {
  class SaveTokenRepositoryStub implements SaveTokenRepository {
    async saveToken (accountId: number, token: string): Promise<SaveTokenRepository.Result> {
      return await new Promise(resolve => { resolve(true) })
    }
  }
  return new SaveTokenRepositoryStub()
}

const makeSut = (): SutTypes => {
  const saveTokenRepositoryStub = makeSaveTokenRepository()
  const sut = new DbSaveToken(saveTokenRepositoryStub)
  return {
    sut,
    saveTokenRepositoryStub
  }
}

describe('DbSaveToken', () => {
  it('Should call SaveTokenRepository with correct values', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    const saveSpy = jest.spyOn(saveTokenRepositoryStub, 'saveToken')
    await sut.save({ accountId: 1, token: 'any_token' })
    expect(saveSpy).toBeCalledWith(1, 'any_token')
  })

  it('Should throw if SaveTokenRepository throws', async () => {
    const { sut, saveTokenRepositoryStub } = makeSut()
    jest.spyOn(saveTokenRepositoryStub, 'saveToken').mockReturnValueOnce(new Promise((resolve, reject) => { reject(new Error()) }))
    const promise = sut.save({ accountId: 1, token: 'any_token' })
    await expect(promise).rejects.toThrow()
  })

  it('Should return true on success', async () => {
    const { sut } = makeSut()
    const response = await sut.save({ accountId: 1, token: 'any_token' })
    expect(response).toBe(true)
  })
})
