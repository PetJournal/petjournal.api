import { type LoadSpecieByNameRepository } from '@/data/protocols'
import { DbAppointSpecie } from '@/data/use-cases'
import { type AppointSpecie } from '@/domain/use-cases'
import { makeFakeSpecieRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbAppointSpecie
  specieRepositoryStub: LoadSpecieByNameRepository
}

const makeSut = (): SutTypes => {
  const specieRepositoryStub = makeFakeSpecieRepository()
  const dependencies: AppointSpecie.Dependencies = {
    specieRepository: specieRepositoryStub
  }
  const sut = new DbAppointSpecie(dependencies)

  return {
    sut,
    specieRepositoryStub
  }
}

describe('DbAppointSpecie Use Case', () => {
  const specieName: AppointSpecie.Params = 'any_name'

  describe('SpecieRepository', () => {
    it('Should return specie equal other and specieAlias equal specieName when specieName is not equal to specie in db', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const otherSpecie = {
        id: 'any_id',
        name: 'Outros'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName')
        .mockResolvedValueOnce(undefined)
        .mockResolvedValueOnce(otherSpecie)

      const result = await sut.appoint(specieName)

      expect(result).toEqual({
        specie: otherSpecie,
        specieAlias: specieName
      })
    })

    it('Should return specie and specieAlias equal Outros when specieName is equal Outros', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadByName').mockResolvedValueOnce({
        id: 'any_id',
        name: 'Outros'
      })

      const result = await sut.appoint(specieName)

      expect(result).toEqual({
        specie: {
          id: 'any_id',
          name: 'Outros'
        },
        specieAlias: 'Outros'
      })
    })

    it('Should calls loadByName with correct params', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const specieRepositorySpy = jest.spyOn(specieRepositoryStub, 'loadByName')

      await sut.appoint(specieName)

      expect(specieRepositorySpy).toHaveBeenCalledWith(specieName)
    })

    it('Should throws if loadByName throws', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadByName').mockRejectedValueOnce(new Error())

      const promise = sut.appoint(specieName)

      await expect(promise).rejects.toThrow()
    })
  })

  it('Should return a specie when success', async () => {
    const { sut } = makeSut()

    const result = await sut.appoint(specieName)

    expect(result).toEqual({
      specie: {
        id: 'any_id',
        name: 'any_name'
      },
      specieAlias: undefined
    })
  })
})
