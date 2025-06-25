import { type LoadCurrentDateTasks } from '@/domain/use-cases'
import { type LoadTasksByDateRepository } from '@/data/protocols'

export class DbLoadCurrentDateTasks implements LoadCurrentDateTasks {
  constructor (
    private readonly eventRepository: LoadTasksByDateRepository
  ) {}

  async load ({ date }: LoadCurrentDateTasks.Params): Promise<LoadCurrentDateTasks .Result> {
    const startOfDay = new Date(date)
    startOfDay.setUTCHours(0, 0, 0, 0)
    const endOfDay = new Date(date)
    endOfDay.setUTCHours(23, 59, 59, 999)

    return await this.eventRepository.loadAllByCurrentDate({
      start: startOfDay,
      end: endOfDay
    })
  }
}
