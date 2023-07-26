import { LoadGuardianNameController } from '@/application/controllers'
import { success } from '@/application/helpers'
import { type LoadGuardianName } from '@/domain/use-cases'
import { makeFakeServerError, makeLoadGuardianNameUseCase } from '@/tests/utils'

interface SutTypes {
  sut: LoadGuardianNameController
  loadGuardianNameStub: LoadGuardianName
}

const makeSut = (): SutTypes => {
  const loadGuardianNameStub = makeLoadGuardianNameUseCase()
  const sut = new LoadGuardianNameController({ loadGuardianName: loadGuardianNameStub })
  return {
    sut,
    loadGuardianNameStub
  }
}

describe('LoadGuardianName Controller', () => {
  it('Should call LoadGuardianName with correct values', async () => {
    const { sut, loadGuardianNameStub } = makeSut()
    const getGuardianNameSpy = jest.spyOn(loadGuardianNameStub, 'load')
    await sut.handle({ userId: 'any_user_id' })
    expect(getGuardianNameSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should returns 500 (ServerError) if LoadGuardianName throws', async () => {
    const { sut, loadGuardianNameStub } = makeSut()
    jest.spyOn(loadGuardianNameStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({ userId: 'any_user_id' })
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return guardian name on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ userId: 'any_user_id' })
    expect(httpResponse).toEqual(success({ firstName: 'any_first_name', lastName: 'any_last_name' }))
  })
})
