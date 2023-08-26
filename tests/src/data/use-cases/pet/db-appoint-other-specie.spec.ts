import { DbAppointOtherSpecie } from '@/data/use-cases'
import { type AppointOtherSpecie } from '@/domain/use-cases'

interface SutTypes {
  sut: DbAppointOtherSpecie
}

const makeSut = (): SutTypes => {
  const sut = new DbAppointOtherSpecie()

  return {
    sut
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

  it('Should return a specie when success', async () => {
    const { sut } = makeSut()

    const result = await sut.appoint(params)

    expect(result).toEqual({
      specieAppointed: params.specie,
      specieAlias: undefined
    })
  })
})
