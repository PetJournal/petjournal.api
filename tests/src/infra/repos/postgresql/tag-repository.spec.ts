import { type AddTagRepository } from '@/data/protocols'
import { TagRepository } from '@/infra/repos/postgresql'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

const makeSut = (): TagRepository => {
  return new TagRepository()
}

describe('TagRepository', () => {
  beforeAll(async () => { await PrismaHelper.connect() })

  beforeEach(async () => {
    await PrismaHelper.clearTag()
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  describe('Add method', () => {
    const params: AddTagRepository.Params = {
      name: 'any_name',
      color: 'any_color'
    }
    it('Should return undefined if an error', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'add').mockRejectedValue(new Error())
      const promise = sut.add(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return a tag on success', async () => {
      const sut = makeSut()
      const tag = await sut.add(params)
      expect(tag).toEqual({
        id: expect.any(String),
        name: 'any_name',
        color: 'any_color'
      })
    })
  })

  describe('LoadById method', () => {
    const params = {
      name: 'any_name',
      color: 'any_color'
    }
    it('Should return null if a invalid tag id is provided', async () => {
      const sut = makeSut()
      const invalidId = 'invalid_id'
      const tag = await sut.loadById(invalidId)
      expect(tag).toBeNull()
    })

    it('Should return a tag on success', async () => {
      const sut = makeSut()
      const tagAdded = await sut.add(params)
      const id = tagAdded?.id as string
      const tag = await sut.loadById(id)
      expect(tag).toEqual({
        id: expect.any(String),
        name: 'any_name',
        color: 'any_color'
      })
    })
  })
})
