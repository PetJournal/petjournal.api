import { NotAcceptableError, ServerError } from '@/application/errors'
import { type DeleteEventByIdRepository, type LoadEventByIdRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type DeleteEventById } from '@/domain/use-cases'

export class DbDeleteEventById implements DeleteEventById {
  private readonly eventRepository: DeleteEventByIdRepository & LoadEventByIdRepository
  private readonly guardianRepository: LoadGuardianByIdRepository

  constructor ({ eventRepository, guardianRepository }: DeleteEventById.Dependencies) {
    this.eventRepository = eventRepository
    this.guardianRepository = guardianRepository
  }

  async deleteById ({ eventId, guardianId }: DeleteEventById.Params): Promise<DeleteEventById.Result> {
    const guardian = await this.guardianRepository.loadById(guardianId)
    if (!guardian) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('userId')
      }
    }
    const event = await this.eventRepository.loadById({ eventId, guardianId })
    if (!event) {
      return {
        isSuccess: false,
        error: new NotAcceptableError('eventId')
      }
    }
    const eventDeletedResult = await this.eventRepository.deleteById({ eventId, guardianId })
    if (!eventDeletedResult) {
      return {
        isSuccess: false,
        error: new ServerError('delete error')
      }
    }
    return {
      isSuccess: true,
      data: undefined
    }
  }
}
