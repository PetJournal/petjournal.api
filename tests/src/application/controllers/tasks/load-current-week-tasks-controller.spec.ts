import { LoadCurrentWeekTasksController } from '@/application/controllers'
import { InvalidParamError } from '@/application/errors'
import { success, serverError, type HttpResponse, badRequest } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type LoadCurrentWeekTasks } from '@/domain/use-cases'
import { makeFakeValidation } from '@/tests/utils'

const makeLoadCurrentWeekTasksUseCase = (): LoadCurrentWeekTasks => ({
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
  sut: LoadCurrentWeekTasksController
  loadCurrentWeekTasksStub: LoadCurrentWeekTasks
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const loadCurrentWeekTasksStub = makeLoadCurrentWeekTasksUseCase()
  const validationStub = makeFakeValidation()
  const sut = new LoadCurrentWeekTasksController({ loadCurrentWeekTasks: loadCurrentWeekTasksStub, validation: validationStub })
  return {
    sut,
    loadCurrentWeekTasksStub,
    validationStub
  }
}

describe('LoadCurrentWeekTasksController', () => {
  beforeAll(() => {
    const fixedDate = new Date('2025-06-18T15:00:00Z')
    jest.useFakeTimers().setSystemTime(fixedDate)
  })

  afterAll(() => {
    jest.useRealTimers()
  })

  it('Should call validation with correct value', async () => {
    const { sut, validationStub } = makeSut()
    const validationSpy = jest.spyOn(validationStub, 'validate')
    await sut.handle({ query: { tagId: 'any_tagId' } })
    expect(validationSpy).toHaveBeenCalledWith({ tagId: 'any_tagId' })
  })

  it('Should return 400(Not Acceptable) if invalid tagId is provided', async () => {
    const { sut, validationStub } = makeSut()
    const error = new InvalidParamError('tagId')
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(error)
    const httpResponse = await sut.handle({ query: { tagId: 'invalid_tagId' } })
    expect(httpResponse).toEqual(badRequest(error))
  })

  it('Should call LoadCurrentWeekTasks with current date at start of day UTC', async () => {
    const { sut, loadCurrentWeekTasksStub } = makeSut()
    const loadSpy = jest.spyOn(loadCurrentWeekTasksStub, 'load')

    const expectedStartOfDay = new Date('2025-06-18T00:00:00.000Z')

    await sut.handle({ query: { tagId: 'any_tagId' } })
    expect(loadSpy).toHaveBeenCalledWith({ date: expectedStartOfDay, tagId: 'any_tagId' })
  })

  it('Should return 500 if LoadCurrentWeekTasks throws', async () => {
    const { sut, loadCurrentWeekTasksStub } = makeSut()
    jest.spyOn(loadCurrentWeekTasksStub, 'load').mockRejectedValueOnce(new Error())
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(makeFakeServerError())
  })

  it('Should return tasks on success', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle({ query: { tagId: 'any_tagId' } })
    expect(httpResponse).toEqual(success([
      { id: 'task1', schedulerId: 'sched_1', start: expect.any(Date), end: expect.any(Date) },
      { id: 'task2', schedulerId: 'sched_2', start: expect.any(Date), end: expect.any(Date) }
    ]))
  })
})
