import { DbLoadNextTasksByPetId } from '@/data/use-cases'
import { type LoadNextTasksByPetIdRepository } from '@/data/protocols'

const makeRepositoryStub = (): LoadNextTasksByPetIdRepository => ({
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

interface SutTypes {
  sut: DbLoadNextTasksByPetId
  repositoryStub: LoadNextTasksByPetIdRepository
}

const makeSut = (): SutTypes => {
  const repositoryStub = makeRepositoryStub()
  const sut = new DbLoadNextTasksByPetId(repositoryStub)
  return {
    sut,
    repositoryStub
  }
}

describe('DbLoadNextTasksByPetId', () => {
  it('Should call repository with correct values', async () => {
    const { sut, repositoryStub } = makeSut()
    const spy = jest.spyOn(repositoryStub, 'loadNextByPetId')

    await sut.load({ petId: 'pet_1', page: 2, limit: 20 })

    expect(spy).toHaveBeenCalledWith({
      petId: 'pet_1',
      page: 2,
      limit: 20
    })
  })

  it('Should return repository result on success', async () => {
    const { sut } = makeSut()

    const result = await sut.load({ petId: 'pet_1', page: 1, limit: 10 })

    expect(result).toEqual({
      page: 1,
      limit: 10,
      totalPages: 1,
      nextEvents: [
        { id: 'task1' },
        { id: 'task2' }
      ]
    })
  })

  it('Should throw if repository throws', async () => {
    const { sut, repositoryStub } = makeSut()
    jest.spyOn(repositoryStub, 'loadNextByPetId')
      .mockRejectedValueOnce(new Error('repo_error'))

    await expect(
      sut.load({ petId: 'pet_1', page: 1, limit: 10 })
    ).rejects.toThrow('repo_error')
  })
})
