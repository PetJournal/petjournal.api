import { LoadCurrentDateTasksController } from '@/application/controllers'
import { success, serverError, type HttpResponse } from '@/application/helpers'
import { type LoadCurrentDateTasks } from '@/domain/use-cases'

const makeLoadCurrentDateTasksUseCase = (): LoadCurrentDateTasks => ({
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
  sut: LoadCurrentDateTasksController
  loadCurrentDateTasksStub: LoadCurrentDateTasks
}

const makeSut = (): SutTypes => {
  const loadCurrentDateTasksStub = makeLoadCurrentDateTasksUseCase()
  const sut = new LoadCurrentDateTasksController({ loadCurrentDateTasks: loadCurrentDateTasksStub })
  return {
    sut,
    loadCurrentDateTasksStub
  }
}

describe('LoadCurrentDateTasksController', () => {
  beforeAll(() => {
    const fixedDate = new Date('2025-06-18T15:00:00Z')
    jest.useFakeTimers().setSystemTime(fixedDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('Should call LoadCurrentDateTasks with current date at start of day UTC', async () => {
    const { sut, loadCurrentDateTasksStub } = makeSut()
    const loadSpy = jest.spyOn(loadCurrentDateTasksStub, 'load')

    const expectedStartOfDay = new Date('2025-06-18T00:00:00.000Z')

    await sut.handle({})
    expect(loadSpy).toHaveBeenCalledWith({ date: expectedStartOfDay })
  })

  it('Should return 500 if LoadCurrentDateTasks throws', async () => {
    const { sut, loadCurrentDateTasksStub } = makeSut()
    jest.spyOn(loadCurrentDateTasksStub, 'load').mockRejectedValueOnce(new Error())
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
