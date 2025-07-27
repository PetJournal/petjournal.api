import { type LoadCurrentMonthTasks } from '@/domain/use-cases'
import { type LoadTasksByIntervalRepository } from '@/data/protocols'

export class DbLoadCurrentMonthTasks implements LoadCurrentMonthTasks {
  constructor (
    private readonly eventRepository: LoadTasksByIntervalRepository
  ) {}

  async load ({ date, tagId }: LoadCurrentMonthTasks.Params): Promise<LoadCurrentMonthTasks.Result> {
    const start = new Date(date)
    start.setUTCHours(0, 0, 0, 0)

    const end = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth() + 1, 0))
    end.setUTCHours(23, 59, 59, 999)

    return await this.eventRepository.loadAllByInterval({
      start,
      end,
      tagId
    })
  }
}
