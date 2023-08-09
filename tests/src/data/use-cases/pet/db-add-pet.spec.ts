import { NotFoundError } from '@/application/errors'
import { DbAddPet } from '@/data/use-cases'
import { type AddPet } from '@/domain/use-cases'

interface SutTypes {
  sut: DbAddPet
}

const makeSut = (): SutTypes => {
  const sut = new DbAddPet()
  return {
    sut
  }
}

describe('DbAddPet Use Case', () => {
  const params: AddPet.Params = {
    guardianId: 'any_guardian_id',
    specieId: 'any_specie_id'
  }
  describe('GuardianRepository', () => {
    it('Should return not found error if incorrect id is provided', async () => {
      const { sut } = makeSut()

      const result = await sut.add(params)

      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('userId')
      })
    })
  })
})
