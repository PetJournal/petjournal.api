import { SizeRepository } from '@/infra/repos/postgresql/size-repository'

const makeSut = (): SizeRepository => {
  return new SizeRepository()
}

describe('SizeRepository', () => {
  describe('LoadByName method', () => {
    it('Should not return a size if invalid name is provided', async () => {
      const sut = makeSut()
      const name = 'invalid_name'
      const result = await sut.loadByName(name)
      expect(result).toBeFalsy()
    })
  })
})
