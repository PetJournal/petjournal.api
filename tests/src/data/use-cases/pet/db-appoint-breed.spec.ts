import { type LoadBreedByNameRepository } from '@/data/protocols'
import { DbAppointBreed } from '@/data/use-cases/pet/db-appoint-breed'
import { type Breed } from '@/domain/models/breed'
import { type AppointBreed } from '@/domain/use-cases'
import { makeFakeBreedRepository } from '@/tests/utils/stubs/service.stub'

interface SutTypes {
  sut: DbAppointBreed
  breedRepositoryStub: LoadBreedByNameRepository
}

const makeSut = (): SutTypes => {
  const breedRepositoryStub = makeFakeBreedRepository()
  const dependencies: AppointBreed.Dependencies = {
    breedRepository: breedRepositoryStub
  }
  const sut = new DbAppointBreed(dependencies)
  return {
    sut,
    breedRepositoryStub
  }
}

describe('DbAppointBreed Use Case', () => {
  const breedName: AppointBreed.Params = 'any_name'

  test('should return a breed equal other and breedAlias equal breedName when breedName is not equal to breed in db', async () => {
    const { sut, breedRepositoryStub } = makeSut()
    const otherBreed = {
      id: 'any_id',
      name: 'Outros'
    }
    jest.spyOn(breedRepositoryStub, 'loadByName')
      .mockResolvedValueOnce(undefined)
      .mockResolvedValueOnce(otherBreed)
    const result = await sut.appoint(breedName)
    expect(result).toEqual({
      breed: otherBreed,
      breedAlias: breedName
    })
  })

  test('should return a breed and breedAlias equal Outros when breedName is equal Outros', async () => {
    const { sut, breedRepositoryStub } = makeSut()
    const otherBreed = {
      id: 'any_id',
      name: 'Outros'
    }
    jest.spyOn(breedRepositoryStub, 'loadByName').mockResolvedValueOnce(otherBreed)
    const result = await sut.appoint(breedName)
    expect(result).toEqual({
      breed: otherBreed as Breed & { id: string },
      breedAlias: 'Outros'
    })
  })

  test('should call loadByName with correct params', async () => {
    const { sut, breedRepositoryStub } = makeSut()
    const breedRepositorySpy = jest.spyOn(breedRepositoryStub, 'loadByName')
    await sut.appoint(breedName)
    expect(breedRepositorySpy).toHaveBeenCalledWith(breedName)
  })

  test('should throw if loadByName throws', async () => {
    const { sut, breedRepositoryStub } = makeSut()
    jest.spyOn(breedRepositoryStub, 'loadByName').mockRejectedValueOnce(new Error())
    const promise = sut.appoint(breedName)
    await expect(promise).rejects.toThrow()
  })
})
