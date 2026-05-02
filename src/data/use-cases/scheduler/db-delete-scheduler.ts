import { NotAcceptableError, ServerError } from '@/application/errors'
import { type LoadGuardianByIdRepository, type DeleteSchedulerByIdRepository, type LoadSchedulerByIdRepository, type DeleteEventsBySchedulerIdRepository } from '@/data/protocols'
import { type DeleteScheduler } from '@/domain/use-cases'

export class DbDeleteScheduler implements DeleteScheduler {
  private readonly schedulerRepository: DeleteSchedulerByIdRepository & LoadSchedulerByIdRepository
  private readonly guardianRepository: LoadGuardianByIdRepository
  private readonly eventRepository: DeleteEventsBySchedulerIdRepository

  constructor ({ schedulerRepository, guardianRepository, eventRepository }: DeleteScheduler.Dependencies) {
    this.schedulerRepository = schedulerRepository
    this.guardianRepository = guardianRepository
    this.eventRepository = eventRepository
  }

  async delete (params: DeleteScheduler.Params): Promise<DeleteScheduler.Result> {
    const guardian = await this.guardianRepository.loadById(params.guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('UserId')
      }
    }
    const scheduler = await this.schedulerRepository.load({ guardianId: guardian.id, schedulerId: params.schedulerId })
    if (!scheduler) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('SchedulerId')
      }
    }
    const deleteEventResult = this.eventRepository.delete({ guardianId: guardian.id, schedulerId: scheduler.id })
    if (!deleteEventResult) {
      return {
        isSuccess: false,
        error: new ServerError('delete error')
      }
    }
    const deleteSchedulerResult = this.schedulerRepository.delete({ guardianId: guardian.id, schedulerId: scheduler.id })
    if (!deleteSchedulerResult) {
      return {
        isSuccess: false,
        error: new ServerError('delete error')
      }
    }

    return {
      isSuccess: true
    }
  }
}
