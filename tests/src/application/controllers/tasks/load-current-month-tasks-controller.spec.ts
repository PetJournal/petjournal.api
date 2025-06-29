import { LoadCurrentMonthTasksController } from '@/application/controllers'
import { success, serverError, type HttpResponse } from '@/application/helpers'
import { type LoadCurrentMonthTasks } from '@/domain/use-cases'

const makeLoadCurrentMonthTasksUseCase = (): LoadCurrentMonthTasks => ({
  load: jest.fn().mockResolvedValue([
    { id: 'task1', schedulerId: 'sched_1', start: new Date(), end: new Date() },
    { id: 'task2', schedulerId: 'sched_2', start: new Date(), end: new Date() }
  ])
})

const makeFakeServerError = (): HttpResponse => {
  const error = new Error('internal_error')
  return serverError(error)
}

interface SutTypes {
  sut: LoadCurrentMonthTasksController
  loadCurrentMonthTasksStub: LoadCurrentMonthTasks
}

const makeSut = (): SutTypes => {
  const loadCurrentMonthTasksStub = makeLoadCurrentMonthTasksUseCase()
  const sut = new LoadCurrentMonthTasksController({ loadCurrentMonthTasks: loadCurrentMonthTasksStub })
  return {
    sut,
    loadCurrentMonthTasksStub
  }
}

describe('LoadCurrentMonthTasksController', () => {
  beforeAll(() => {
    const fixedDate = new Date('2025-06-18T15:00:00Z')
    jest.useFakeTimers().setSystemTime(fixedDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('Should call LoadCurrentMonthTasks with current date at start of day UTC', async () => {
    const { sut, loadCurrentMonthTasksStub } = makeSut()
    const loadSpy = jest.spyOn(loadCurrentMonthTasksStub, 'load')

    const expectedStartOfDay = new Date('2025-06-18T00:00:00.000Z')

    await sut.handle({})
    expect(loadSpy).toHaveBeenCalledWith({ date: expectedStartOfDay })
  })

  it('Should return 500 if LoadCurrentMonthTasks throws', async () => {
    const { sut, loadCurrentMonthTasksStub } = makeSut()
    jest.spyOn(loadCurrentMonthTasksStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return tasks on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(success([
      { id: 'task1', schedulerId: 'sched_1', start: expect.any(Date), end: expect.any(Date) },
      { id: 'task2', schedulerId: 'sched_2', start: expect.any(Date), end: expect.any(Date) }
    ]))
  })
})
