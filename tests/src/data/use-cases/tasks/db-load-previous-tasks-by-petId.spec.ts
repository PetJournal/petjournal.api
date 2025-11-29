import { DbLoadPreviousTasksByPetId } from '@/data/use-cases'
import { type LoadPreviousTasksByPetIdRepository } from '@/data/protocols'

const makeRepositoryStub = (): LoadPreviousTasksByPetIdRepository => ({
  loadPreviousByPetId: jest.fn().mockResolvedValue({
    page: 1,
    limit: 10,
    totalPages: 1,
    history: [
      { id: 'old1' },
      { id: 'old2' }
    ]
  })
})

interface SutTypes {
  sut: DbLoadPreviousTasksByPetId
  repositoryStub: LoadPreviousTasksByPetIdRepository
}

const makeSut = (): SutTypes => {
  const repositoryStub = makeRepositoryStub()
  const sut = new DbLoadPreviousTasksByPetId(repositoryStub)
  return {
    sut,
    repositoryStub
  }
}

describe('DbLoadPreviousTasksByPetId', () => {
  it('Should call repository with correct values', async () => {
    const { sut, repositoryStub } = makeSut()
    const spy = jest.spyOn(repositoryStub, 'loadPreviousByPetId')

    await sut.load({ petId: 'pet_1', page: 3, limit: 15 })

    expect(spy).toHaveBeenCalledWith({
      petId: 'pet_1',
      page: 3,
      limit: 15
    })
  })

  it('Should return repository result on success', async () => {
    const { sut } = makeSut()

    const result = await sut.load({ petId: 'pet_1', page: 1, limit: 10 })

    expect(result).toEqual({
      page: 1,
      limit: 10,
      totalPages: 1,
      history: [
        { id: 'old1' },
        { id: 'old2' }
      ]
    })
  })

  it('Should throw if repository throws', async () => {
    const { sut, repositoryStub } = makeSut()
    jest.spyOn(repositoryStub, 'loadPreviousByPetId')
      .mockRejectedValueOnce(new Error('repo_error'))

    await expect(
      sut.load({ petId: 'pet_1', page: 1, limit: 10 })
    ).rejects.toThrow('repo_error')
  })
})
