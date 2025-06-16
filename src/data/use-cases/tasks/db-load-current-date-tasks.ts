import { type LoadCurrentDateTasks } from '@/domain/use-cases'
import { type LoadTasksByDateRepository } from '@/data/protocols'

export class DbLoadCurrentDateTasks implements LoadCurrentDateTasks {
  constructor (
    private readonly loadTasksByDateRepository: LoadTasksByDateRepository
  ) {}

  async load (params: LoadCurrentDateTasks .Params): Promise<LoadCurrentDateTasks .Result> {
    const startOfDay = new Date(params.date)
    startOfDay.setUTCHours(0, 0, 0, 0)

    const endOfDay = new Date(params.date)
    endOfDay.setUTCHours(23, 59, 59, 999)

    return await this.loadTasksByDateRepository.loadByDate({
      start: startOfDay,
      end: endOfDay
    })
  }
}
