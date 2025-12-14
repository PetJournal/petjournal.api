import { NotFoundError } from '@/application/errors'
import { type LoadNextTasksByPetIdAndTagIdRepository, type LoadPetByIdRepository, type LoadTagByIdRepository } from '@/data/protocols'
import { DbLoadNextTasksByPetIdAndTagId } from '@/data/use-cases'
import { type LoadNextTasksByPetIdAndTagId } from '@/domain/use-cases'
import { makeFakeEventRepository, makeFakePetRepository, makeFakeTagRepository } from '@/tests/utils'

interface SutTypes {
  sut: DbLoadNextTasksByPetIdAndTagId
  petRepositoryStub: LoadPetByIdRepository
  tagRepositoryStub: LoadTagByIdRepository
  eventRepositoryStub: LoadNextTasksByPetIdAndTagIdRepository
}

const makeSut = (): SutTypes => {
  const petRepositoryStub = makeFakePetRepository()
  const tagRepositoryStub = makeFakeTagRepository()
  const eventRepositoryStub = makeFakeEventRepository()
  const dependencies: LoadNextTasksByPetIdAndTagId.Dependencies = {
    petRepository: petRepositoryStub,
    tagRepository: tagRepositoryStub,
    eventRepository: eventRepositoryStub
  }
  const sut = new DbLoadNextTasksByPetIdAndTagId(dependencies)
  return {
    sut,
    petRepositoryStub,
    tagRepositoryStub,
    eventRepositoryStub
  }
}

describe('DbLoadNextTasksByPetIdAndTagId', () => {
  const params: LoadNextTasksByPetIdAndTagId.Params = {
    petId: 'any_id',
    tagId: 'any_id',
    limit: 10,
    page: 1
  }

  describe('PetRepository', () => {
    it('Should call pet repository with correct value', async () => {
      const { sut, petRepositoryStub } = makeSut()
      const petRepositorySpy = jest.spyOn(petRepositoryStub, 'loadById')
      await sut.load(params)
      expect(petRepositorySpy).toHaveBeenCalledWith(params.petId)
    })

    it('Should throw if pet repository throws', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
      const promise = sut.load(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotFoundError if an invalid petId is provided', async () => {
      const { sut, petRepositoryStub } = makeSut()
      jest.spyOn(petRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.load(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('petId')
      })
    })
  })

  describe('TagRepository', () => {
    it('Should call tag repository with correct value', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      const tagRepositorySpy = jest.spyOn(tagRepositoryStub, 'loadById')
      await sut.load(params)
      expect(tagRepositorySpy).toHaveBeenCalledWith(params.tagId)
    })

    it('Should throw if tag repository throws', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockRejectedValueOnce(new Error())
      const promise = sut.load(params)
      await expect(promise).rejects.toThrow()
    })

    it('Should return NotFoundError if an invalid tagId is provided', async () => {
      const { sut, tagRepositoryStub } = makeSut()
      jest.spyOn(tagRepositoryStub, 'loadById').mockResolvedValueOnce(null)
      const result = await sut.load(params)
      expect(result).toEqual({
        isSuccess: false,
        error: new NotFoundError('tagId')
      })
    })
  })

  describe('EventRepository', () => {
    it('Should call event repository with correct value', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      const eventRepositorySpy = jest.spyOn(eventRepositoryStub, 'loadByPetIdAndTagId')
      await sut.load(params)
      expect(eventRepositorySpy).toHaveBeenCalledWith({ petId: params.petId, tagId: params.tagId })
    })

    it('Should throw if event repository throws', async () => {
      const { sut, eventRepositoryStub } = makeSut()
      jest.spyOn(eventRepositoryStub, 'loadByPetIdAndTagId').mockRejectedValueOnce(new Error())
      const promise = sut.load(params)
      await expect(promise).rejects.toThrow()
    })
  })
})
