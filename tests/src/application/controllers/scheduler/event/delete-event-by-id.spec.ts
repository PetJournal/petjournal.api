import { DeleteEventByIdController } from '@/application/controllers'
import { NotAcceptableError, ServerError } from '@/application/errors'
import { notAcceptable, serverError, success } from '@/application/helpers'
import { type DeleteEventById } from '@/domain/use-cases'
import { makeFakeDeleteEventByIdRequest, makeFakeDeleteEventByIdUseCase } from '@/tests/utils'

interface SutTypes {
  sut: DeleteEventByIdController
  deleteEventStub: DeleteEventById
}

const makeSut = (): SutTypes => {
  const deleteEventStub = makeFakeDeleteEventByIdUseCase()
  const dependencies: DeleteEventByIdController.Dependencies = {
    deleteEvent: deleteEventStub
  }
  const sut = new DeleteEventByIdController(dependencies)
  return {
    sut,
    deleteEventStub
  }
}

describe('DeleteEventById Controller', () => {
  const httpRequest = makeFakeDeleteEventByIdRequest()
  describe('DeleteById Use case', () => {
    it('Should return 406(NotAcceptable) if an invalid eventId is provided', async () => {
      const { sut, deleteEventStub } = makeSut()
      jest.spyOn(deleteEventStub, 'deleteById').mockResolvedValue({
        isSuccess: false,
        error: new NotAcceptableError('eventId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotAcceptableError('eventId')))
    })

    it('Should return 500(serverError) if deleteEvent throws', async () => {
      const { sut, deleteEventStub } = makeSut()
      jest.spyOn(deleteEventStub, 'deleteById').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError('Internal Server Error')))
    })

    it('Should call deleteEvent with correct values', async () => {
      const { sut, deleteEventStub } = makeSut()
      const spyDeleteEvent = jest.spyOn(deleteEventStub, 'deleteById')
      await sut.handle(httpRequest)
      expect(spyDeleteEvent).toHaveBeenCalledWith({ eventId: 'any_event_id', guardianId: 'any_guardian_id' })
    })
  })

  it('Should return 200(success) if event was deleted', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(success({
      message: 'event deleted',
      eventId: 'any_event_id'
    }))
  })
})
