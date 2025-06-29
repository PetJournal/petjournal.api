import { DbLoadCurrentWeekTasks } from '@/data/use-cases'
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
    description: 'Outside interval - Monday',
    date: new Date('2024-04-01T10:00:00Z')
  },
  {
    id: 'task2',
    title: 'Task 2',
    description: 'Inside interval - Wednesday',
    date: new Date('2024-04-03T15:00:00Z')
  },
  {
    id: 'task3',
    title: 'Task 3',
    description: 'Inside interval - Thursday',
    date: new Date('2024-04-04T12:00:00Z')
  },
  {
    id: 'task4',
    title: 'Task 4',
    description: 'Inside interval - Saturday',
    date: new Date('2024-04-06T18:30:00Z')
  },
  {
    id: 'task5',
    title: 'Task 5',
    description: 'Outside interval - Next Sunday',
    date: new Date('2024-04-07T08:00:00Z')
  }
])

const makeFakeTaskRepository = (): LoadTasksByIntervalRepository => ({
  loadAllByInterval: jest.fn().mockImplementation(async ({ start, end }) => {
    return makeFakeTasks().filter(task => {
      const time = task.date.getTime()
      return time >= start.getTime() && time <= end.getTime()
    })
  })
})

interface SutTypes {
  sut: DbLoadCurrentWeekTasks
  taskRepositoryStub: LoadTasksByIntervalRepository
}

const makeSut = (): SutTypes => {
  const taskRepositoryStub = makeFakeTaskRepository()
  const sut = new DbLoadCurrentWeekTasks(taskRepositoryStub)
  return {
    sut,
    taskRepositoryStub
  }
}

describe('DbLoadCurrentWeekTasks', () => {
  it('Should return only tasks from the current day to Saturday of the same week', async () => {
    const { sut } = makeSut()
    const inputDate = new Date('2024-04-03T12:00:00Z')
    const result = await sut.load({ date: inputDate })

    const expectedTasks = makeFakeTasks().filter(task => {
      const time = task.date.getTime()
      const start = new Date(Date.UTC(2024, 3, 3, 0, 0, 0, 0)).getTime()
      const end = new Date(Date.UTC(2024, 3, 6, 23, 59, 59, 999)).getTime()
      return time >= start && time <= end
    })

    expect(result).toEqual(expectedTasks)
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
})
