import { type AppointOtherSpecie } from '@/domain/use-cases'

class DbAppointOtherSpecie implements AppointOtherSpecie {
  async appoint (specie: AppointOtherSpecie.Params): Promise<AppointOtherSpecie.Result> {
    return specie
  }
}

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
    id: 'any_id',
    name: 'any_name',
    otherAlias: null
  }

  it('Should return a specie when success', async () => {
    const { sut } = makeSut()

    const result = await sut.appoint(params)

    expect(result).toEqual(params)
  })
})
