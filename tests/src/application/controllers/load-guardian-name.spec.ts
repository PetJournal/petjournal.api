import { type LoadGuardian } from '@/domain/use-cases'
import { LoadGuardianController } from '@/application/controllers'
import { success } from '@/application/helpers'
import { makeFakeServerError, makeLoadGuardianNameUseCase } from '@/tests/utils'

interface SutTypes {
  sut: LoadGuardianController
  loadGuardianStub: LoadGuardian
}

const makeSut = (): SutTypes => {
  const loadGuardianStub = makeLoadGuardianNameUseCase()
  const sut = new LoadGuardianController({ loadGuardian: loadGuardianStub })
  return {
    sut,
    loadGuardianStub
  }
}

describe('LoadGuardianName Controller', () => {
  it('Should call LoadGuardianName with correct values', async () => {
    const { sut, loadGuardianStub } = makeSut()
    const getGuardianNameSpy = jest.spyOn(loadGuardianStub, 'load')
    await sut.handle({ userId: 'any_user_id' })
    expect(getGuardianNameSpy).toHaveBeenCalledWith('any_user_id')
  })

  it('Should returns 500 (ServerError) if LoadGuardianName throws', async () => {
    const { sut, loadGuardianStub } = makeSut()
    jest.spyOn(loadGuardianStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({ userId: 'any_user_id' })
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return guardian name on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ userId: 'any_user_id' })
    expect(httpResponse).toEqual(success({
      firstName: 'any_first_name',
      lastName: 'any_last_name',
      email: 'email@email.com',
      phone: 'any_phone',
      image: 'image.jpg'
    }))
  })
})
