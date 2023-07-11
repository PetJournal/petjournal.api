import { LoadGuardianNameController } from '@/application/controllers'
import { success } from '@/application/helpers'
import { type GetGuardianName } from '@/domain/use-cases'
import { makeFakeServerError, makeGetGuardianName } from '@/tests/utils'

interface SutTypes {
  sut: LoadGuardianNameController
  getGuardianNameStub: GetGuardianName
}

const makeSut = (): SutTypes => {
  const getGuardianNameStub = makeGetGuardianName()
  const sut = new LoadGuardianNameController({ getGuardianName: getGuardianNameStub })
  return {
    sut,
    getGuardianNameStub
  }
}

describe('LoadGuardianName Controller', () => {
  it('Should call GetGuardianName with correct values', async () => {
    const { sut, getGuardianNameStub } = makeSut()
    const getGuardianNameSpy = jest.spyOn(getGuardianNameStub, 'load')
    await sut.handle({ userId: 'any_user_id' })
    expect(getGuardianNameSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should throw if GetGuardianName throws', async () => {
    const { sut, getGuardianNameStub } = makeSut()
    jest.spyOn(getGuardianNameStub, 'load').mockReturnValueOnce(Promise.reject(new Error()))
    const httpResponse = await sut.handle({ userId: 'any_user_id' })
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return guardian name on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ userId: 'any_user_id' })
    expect(httpResponse.statusCode).toBe(200)
    expect(httpResponse).toEqual(success({ firstName: 'any_first_name', lastName: 'any_last_name' }))
  })
})
