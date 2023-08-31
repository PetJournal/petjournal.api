import { InvalidParamError } from '@/application/errors'
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

  describe('specieAlias', () => {
    it('should return InvalidParamsError if specie is Outros and specieAlias is undefined', async () => {
      const { sut } = makeSut()
      const otherEmpty = {
        specie: {
          id: 'any_id',
          name: 'Outros'
        },
        specieAlias: undefined
      }

      const result = await sut.appoint(otherEmpty)

      expect(result).toEqual({
        isSuccess: false,
        error: new InvalidParamError('specieAlias')
      })
    })
  })

  describe('LoadSpecieByName', () => {
    it('should return specieAppointed equal other when specieAlias is not equal to specie name in db', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const modifiedParams = {
        specie: {
          id: 'any_id',
          name: 'other'
        },
        specieAlias: 'any_specie'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName').mockResolvedValueOnce(undefined)

      const result = await sut.appoint(modifiedParams)

      expect(result).toEqual({
        isSuccess: true,
        data: {
          specieAppointed: modifiedParams.specie,
          specieAlias: modifiedParams.specieAlias
        }
      })
    })

    it('should return specieAppointed equal any_specie when specieAlias is equal to any_specie name in db', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const modifiedParams = {
        specie: {
          id: 'any_id',
          name: 'other'
        },
        specieAlias: 'any_specie'
      }
      jest.spyOn(specieRepositoryStub, 'loadByName').mockResolvedValueOnce({
        id: 'any_id',
        name: 'any_specie'
      })

      const result = await sut.appoint(modifiedParams)

      expect(result).toEqual({
        isSuccess: true,
        data: {
          specieAppointed: {
            id: 'any_id',
            name: 'any_specie'
          },
          specieAlias: undefined
        }
      })
    })

    it('should calls loadByName with correct params', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      const specieRepositorySpy = jest.spyOn(specieRepositoryStub, 'loadByName')

      await sut.appoint(params)

      expect(specieRepositorySpy).toHaveBeenCalledWith(params.specieAlias)
    })

    it('should throws if loadByName throws', async () => {
      const { sut, specieRepositoryStub } = makeSut()
      jest.spyOn(specieRepositoryStub, 'loadByName').mockRejectedValueOnce(new Error())

      const promise = sut.appoint(params)

      await expect(promise).rejects.toThrow()
    })
  })

  it('Should return a specie when success', async () => {
    const { sut } = makeSut()

    const result = await sut.appoint(params)

    expect(result).toEqual({
      isSuccess: true,
      data: {
        specieAppointed: params.specie,
        specieAlias: undefined
      }
    })
  })
})
