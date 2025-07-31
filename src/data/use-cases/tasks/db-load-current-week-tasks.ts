import { type LoadCurrentWeekTasks } from '@/domain/use-cases'
import { type LoadTasksByIntervalRepository } from '@/data/protocols'

export class DbLoadCurrentWeekTasks implements LoadCurrentWeekTasks {
  constructor (
    private readonly eventRepository: LoadTasksByIntervalRepository
  ) {}

  async load ({ date, tagId }: LoadCurrentWeekTasks.Params): Promise<LoadCurrentWeekTasks.Result> {
    const start = new Date(date)
    start.setUTCHours(0, 0, 0, 0)

    const dayOfWeek = start.getUTCDay()
    const daysUntilEndOfWeek = 6 - dayOfWeek

    const end = new Date(start)
    end.setUTCDate(start.getUTCDate() + daysUntilEndOfWeek)
    end.setUTCHours(23, 59, 59, 999)

    return await this.eventRepository.loadAllByInterval({
      start,
      end,
      tagId
    })
  }
}
