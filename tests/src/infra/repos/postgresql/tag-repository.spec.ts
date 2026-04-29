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
    await PrismaHelper.clearGuardian()
  })

  afterAll(async () => { await PrismaHelper.disconnect() })

  const params: AddTagRepository.Params = {
    guardianId: 'any_guardian_id',
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
      const guardian = await PrismaHelper.createGuardian()
      const tag = await sut.add({ ...params, guardianId: guardian.id })
      expect(tag).toEqual({
        id: expect.any(String),
        guardianId: expect.any(String),
        name: 'any_name',
        color: 'any_color'
      })
    })
  })

  describe('LoadById method', () => {
    it('Should return null if a invalid tag id is provided', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const invalidId = 'invalid_id'
      const tag = await sut.loadById({ guardianId: guardian.id, tagId: invalidId })
      expect(tag).toBeNull()
    })

    it('Should return a tag on success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const tagAdded = await sut.add({ ...params, guardianId: guardian.id })
      const id = tagAdded?.id as string
      const tag = await sut.loadById({ guardianId: guardian.id, tagId: id })
      expect(tag).toEqual({
        id: expect.any(String),
        guardianId: expect.any(String),
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
      const tag = await sut.update({ guardianId: 'any_guardian_id', id: 'invalid_id', name: 'updated_name' })
      expect(tag).toBeUndefined()
    })

    it('Should return an updated tag on success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const addedTag = await sut.add({ ...params, guardianId: guardian.id })
      const id = addedTag?.id as string
      const updatedTag = await sut.update({ guardianId: guardian.id, id, name: 'updated_name' })
      expect(updatedTag).toEqual({
        id: expect.any(String),
        guardianId: expect.any(String),
        name: 'updated_name',
        color: 'any_color'
      })
    })
  })

  describe('LoadAll method', () => {
    it('Should return an empty array if there are not tags', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const tags = await sut.loadAll(guardian.id)
      expect(tags).toEqual([])
    })

    it('Should return an array of tags on success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      await sut.add({ ...params, guardianId: guardian.id })
      const tags = await sut.loadAll(guardian.id)
      expect(tags).toEqual([{
        id: expect.any(String),
        guardianId: expect.any(String),
        name: 'any_name',
        color: 'any_color'
      }])
    })
  })

  describe('DeleteById method', () => {
    it('Should return false if an invalid tag id is provided', async () => {
      const sut = makeSut()
      jest.spyOn(sut, 'deleteById').mockResolvedValueOnce(false)
      const result = await sut.deleteById({ guardianId: 'any_guardian_id', tagId: 'any_tag_id' })
      expect(result).toBe(false)
    })

    it('Should return true on success', async () => {
      const sut = makeSut()
      const guardian = await PrismaHelper.createGuardian()
      const tag = await sut.add({ ...params, guardianId: guardian.id })
      const tagId = tag?.id as string
      const result = await sut.deleteById({ guardianId: guardian.id, tagId })
      expect(result).toBe(true)
    })
  })
})
