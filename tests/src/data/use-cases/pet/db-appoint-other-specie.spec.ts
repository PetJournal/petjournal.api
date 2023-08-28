import { type LoadSpecieByNameRepository } from '@/data/protocols'
import { DbAppointOtherSpecie } from '@/data/use-cases'
import { type AppointOtherSpecie } from '@/domain/use-cases'
import { makeFakeSpecieRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbAppointOtherSpecie
  specieRepositoryStub: LoadSpecieByNameRepository
}

const makeSut = (): SutTypes => {
  const specieRepositoryStub = makeFakeSpecieRepository()
  const dependencies: AppointOtherSpecie.Dependencies = {
    specieRepository: specieRepositoryStub
  }
  const sut = new DbAppointOtherSpecie(dependencies)

  return {
    sut,
    specieRepositoryStub
  }
}

describe('DbAppointOtherSpecie Use Case', () => {
  const params: AppointOtherSpecie.Params = {
    specie: {
      id: 'any_id',
      name: 'any_name'
    },
    specieAlias: 'any_alias'
  }

  describe('specie different of other', () => {
    it('Should return undefined specieAlias when specieAlias is not provided', async () => {
      const { sut } = makeSut()
      const modifiedParams = {
        ...params,
        specieAlias: undefined
      }

      const result = await sut.appoint(modifiedParams)

      expect(result).toEqual({
        specieAppointed: result.specieAppointed,
        specieAlias: undefined
      })
    })

    it('Should return undefined specieAlias when specieAlias is provided', async () => {
      const { sut } = makeSut()
      const modifiedParams = {
        ...params,
        specieAlias: 'any_alias'
      }

      const result = await sut.appoint(modifiedParams)

      expect(result).toEqual({
        specieAppointed: result.specieAppointed,
        specieAlias: undefined
      })
    })
  })

  describe('LoadSpecies', () => {
    it('should return specieAppointed equal other when specieAlias is not equal to specie name in db', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const modifiedParams = {
        specie: {
          id: 'any_id',
          name: 'other'
        },
        specieAlias: 'new_specie'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName').mockResolvedValueOnce(undefined)

      const result = await sut.appoint(modifiedParams)

      expect(result).toEqual({
        specieAppointed: modifiedParams.specie,
        specieAlias: modifiedParams.specieAlias
      })
    })
  })

  it('Should return a specie when success', async () => {
    const { sut } = makeSut()

    const result = await sut.appoint(params)

    expect(result).toEqual({
      specieAppointed: params.specie,
      specieAlias: undefined
    })
  })
})
