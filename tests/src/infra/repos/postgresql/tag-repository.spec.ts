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

  const params = {
    name: 'any_name',
    color: 'any_color'
  }

  describe('Add method', () => {
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
    it('Should return null if a invalid tag id is provided', async () => {
      const sut = makeSut()
      await sut.add(params)
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

  describe('Update method', () => {
    it('Should return undefined if a tag are not found', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'update').mockResolvedValueOnce(undefined)
      await sut.add(params)
      const tag = await sut.update({ id: 'invalid_id', name: 'updated_name' })
      expect(tag).toBeUndefined()
    })

    it('Should return an updated tag on success', async () => {
      const sut = makeSut()
      const addedTag = await sut.add(params)
      const id = addedTag?.id as string
      const updatedTag = await sut.update({ id, name: 'updated_name' })
      expect(updatedTag).toEqual({
        id: expect.any(String),
        name: 'updated_name',
        color: 'any_color'
      })
    })
  })
})
