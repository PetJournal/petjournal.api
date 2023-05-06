import { DbSaveToken } from '@/data/use-cases'
import { type SaveTokenRepository } from '@/data/protocols'

describe('DbSaveToken', () => {
  it('Should call SaveTokenRepository with correct values', async () => {
    class SaveTokenRepositoryStub implements SaveTokenRepository {
      async saveToken (accountId: number, token: string): Promise<SaveTokenRepository.Result> {
        return await new Promise(resolve => { resolve(true) })
      }
    }
    const saveTokenRepositoryStub = new SaveTokenRepositoryStub()
    const saveSpy = jest.spyOn(saveTokenRepositoryStub, 'saveToken')
    const sut = new DbSaveToken(saveTokenRepositoryStub)
    await sut.save({ accountId: 1, token: 'any_token' })
    expect(saveSpy).toBeCalledWith(1, 'any_token')
  })
})
