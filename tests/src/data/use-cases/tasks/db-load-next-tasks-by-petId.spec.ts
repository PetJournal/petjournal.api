import { DbLoadNextTasksByPetId } from '@/data/use-cases'
import { NotFoundError } from '@/application/errors'
import {
  type LoadNextTasksByPetIdRepository,
  type LoadPetByIdRepository
} from '@/data/protocols'

const makeTasksRepositoryStub = (): LoadNextTasksByPetIdRepository => ({
  loadNextByPetId: jest.fn().mockResolvedValue({
    page: 1,
    limit: 10,
    totalPages: 1,
    nextEvents: [
      { id: 'task1' },
      { id: 'task2' }
    ]
  })
})

const makePetRepositoryStub = (): LoadPetByIdRepository => ({
  loadById: jest.fn().mockResolvedValue({
    id: 'pet_1'
  })
})

interface SutTypes {
  sut: DbLoadNextTasksByPetId
  tasksRepositoryStub: LoadNextTasksByPetIdRepository
  petRepositoryStub: LoadPetByIdRepository
}

const makeSut = (): SutTypes => {
  const tasksRepositoryStub = makeTasksRepositoryStub()
  const petRepositoryStub = makePetRepositoryStub()

  const sut = new DbLoadNextTasksByPetId(
    tasksRepositoryStub,
    petRepositoryStub
  )

  return {
    sut,
    tasksRepositoryStub,
    petRepositoryStub
  }
}

describe('DbLoadNextTasksByPetId', () => {
  it('Should call petRepository with correct petId', async () => {
    const { sut, petRepositoryStub } = makeSut()
    const spy = jest.spyOn(petRepositoryStub, 'loadById')

    await sut.load({ guardianId: 'any_guardian_id', petId: 'pet_1', page: 1, limit: 10 })

    expect(spy).toHaveBeenCalledWith({ guardianId: 'any_guardian_id', petId: 'pet_1' })
  })

  it('Should return NotFoundError if pet does not exist', async () => {
    const { sut, petRepositoryStub } = makeSut()
    jest.spyOn(petRepositoryStub, 'loadById').mockResolvedValueOnce(null)

    const result = await sut.load({ guardianId: 'any_guardian_id', petId: 'invalid_pet' })

    expect(result).toEqual({
      isSuccess: false,
      error: new NotFoundError('petId')
    })
  })

  it('Should call tasks repository with correct values', async () => {
    const { sut, tasksRepositoryStub } = makeSut()
    const spy = jest.spyOn(tasksRepositoryStub, 'loadNextByPetId')

    await sut.load({ guardianId: 'any_guardian_id', petId: 'pet_1', page: 2, limit: 20 })

    expect(spy).toHaveBeenCalledWith({
      guardianId: 'any_guardian_id',
      petId: 'pet_1',
      page: 2,
      limit: 20
    })
  })

  it('Should return tasks on success', async () => {
    const { sut } = makeSut()

    const result = await sut.load({ guardianId: 'any_guardian_id', petId: 'pet_1', page: 1, limit: 10 })

    expect(result).toEqual({
      isSuccess: true,
      data: {
        page: 1,
        limit: 10,
        totalPages: 1,
        nextEvents: [
          { id: 'task1' },
          { id: 'task2' }
        ]
      }
    })
  })

  it('Should throw if tasks repository throws', async () => {
    const { sut, tasksRepositoryStub } = makeSut()
    jest
      .spyOn(tasksRepositoryStub, 'loadNextByPetId')
      .mockRejectedValueOnce(new Error('repo_error'))

    await expect(
      sut.load({ guardianId: 'any_guardian_id', petId: 'pet_1', page: 1, limit: 10 })
    ).rejects.toThrow('repo_error')
  })
})
