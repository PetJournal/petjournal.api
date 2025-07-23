import { DbLoadCurrentDateTasks } from '@/data/use-cases'
import { type LoadTasksByIntervalRepository } from '@/data/protocols'

interface TaskModel {
  id: string
  title: string
  description?: string
  date: Date
}

const makeFakeTasks = (): TaskModel[] => ([
  {
    id: 'task1',
    title: 'Task 1',
    description: 'Some description',
    date: new Date('2024-04-01T10:00:00Z')
  },
  {
    id: 'task2',
    title: 'Task 2',
    description: 'Another description',
    date: new Date('2024-04-01T15:00:00Z')
  }
])

const makeFakeTaskRepository = (): LoadTasksByIntervalRepository => ({
  loadAllByInterval: jest.fn().mockResolvedValue(makeFakeTasks())
})

interface SutTypes {
  sut: DbLoadCurrentDateTasks
  taskRepositoryStub: LoadTasksByIntervalRepository
}

const makeSut = (): SutTypes => {
  const taskRepositoryStub = makeFakeTaskRepository()
  const sut = new DbLoadCurrentDateTasks(taskRepositoryStub)
  return {
    sut,
    taskRepositoryStub
  }
}

describe('DbLoadCurrentDateTasks', () => {
  it('Should call loadByDate with correct UTC start and end of day', async () => {
    const { sut, taskRepositoryStub } = makeSut()
    const loadByDateSpy = jest.spyOn(taskRepositoryStub, 'loadAllByInterval')
    const inputDate = new Date('2024-04-01T12:34:56Z')

    await sut.load({ date: inputDate })

    expect(loadByDateSpy).toHaveBeenCalledWith({
      start: new Date(Date.UTC(2024, 3, 1, 0, 0, 0, 0)),
      end: new Date(Date.UTC(2024, 3, 1, 23, 59, 59, 999))
    })
  })

  it('Should return tasks from repository', async () => {
    const { sut } = makeSut()
    const tasks = await sut.load({ date: new Date('2024-04-01') })
    expect(tasks).toEqual(makeFakeTasks())
  })

  it('Should return an empty array if repository returns an empty array', async () => {
    const { sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'loadAllByInterval').mockResolvedValueOnce([])
    const tasks = await sut.load({ date: new Date('2024-04-01') })
    expect(tasks).toEqual([])
  })

  it('Should throw if repository throws', async () => {
    const { sut, taskRepositoryStub } = makeSut()
    jest.spyOn(taskRepositoryStub, 'loadAllByInterval').mockRejectedValueOnce(new Error('fail'))
    const promise = sut.load({ date: new Date() })
    await expect(promise).rejects.toThrow('fail')
  })

  it('Should forward tagId to repository if provided', async () => {
    const { sut, taskRepositoryStub } = makeSut()
    const loadSpy = jest.spyOn(taskRepositoryStub, 'loadAllByInterval')

    const date = new Date('2024-04-01T12:00:00Z')
    const tagId = 'tag-123'

    await sut.load({ date, tagId })

    expect(loadSpy).toHaveBeenCalledWith({
      start: new Date(Date.UTC(2024, 3, 1, 0, 0, 0, 0)),
      end: new Date(Date.UTC(2024, 3, 1, 23, 59, 59, 999)),
      tagId
    })
  })
})
