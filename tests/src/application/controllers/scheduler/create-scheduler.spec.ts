import { CreateSchedulerController } from '@/application/controllers'
import { NotAcceptableError, ServerError } from '@/application/errors'
import { badRequest, create, notAcceptable, serverError } from '@/application/helpers'
import { type Validation } from '@/application/protocols'
import { type AddScheduler } from '@/domain/use-cases'
import { makeFakeAddSchedulerRequest, makeFakeAddSchedulerUseCase, makeFakeValidation } from '@/tests/utils'

interface SutTypes {
  sut: CreateSchedulerController
  addSchedulerStub: AddScheduler
  validationStub: Validation
}

const makeSut = (): SutTypes => {
  const addSchedulerStub = makeFakeAddSchedulerUseCase()
  const validationStub = makeFakeValidation()
  const dependencies: CreateSchedulerController.Dependencies = {
    addScheduler: addSchedulerStub,
    validation: validationStub
  }
  const sut = new CreateSchedulerController(dependencies)
  return {
    sut,
    addSchedulerStub,
    validationStub
  }
}

describe('CreateScheduler Controller', () => {
  const httpRequest = makeFakeAddSchedulerRequest()
  describe('AddScheduler Use case', () => {
    it('Should return 406(Not Acceptable) if invalid tagId is provided', async () => {
      const { sut, addSchedulerStub } = makeSut()
      jest.spyOn(addSchedulerStub, 'add').mockResolvedValue({
        isSuccess: false,
        error: new NotAcceptableError('tagId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotAcceptableError('tagId')))
    })

    it('Should return 406(Not Acceptable) if invalid petId is provided', async () => {
      const { sut, addSchedulerStub } = makeSut()
      jest.spyOn(addSchedulerStub, 'add').mockResolvedValue({
        isSuccess: false,
        error: new NotAcceptableError('petId')
      })
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(notAcceptable(new NotAcceptableError('petId')))
    })

    it('Should return 500(Server Error) if add throws', async () => {
      const { sut, addSchedulerStub } = makeSut()
      jest.spyOn(addSchedulerStub, 'add').mockRejectedValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(serverError(new ServerError('Internal Server Error')))
    })

    it('Should call add with correct values', async () => {
      const { sut, addSchedulerStub } = makeSut()
      const addSpy = jest.spyOn(addSchedulerStub, 'add')
      await sut.handle(httpRequest)
      expect(addSpy).toHaveBeenCalledWith({
        tagId: httpRequest.body.tagId,
        guardianId: httpRequest.userId,
        title: httpRequest.body.title,
        description: httpRequest.body.description,
        note: httpRequest.body.note,
        startAt: httpRequest.body.startAt,
        endAt: httpRequest.body.endAt,
        daysOfWeek: httpRequest.body.daysOfWeek,
        daysOfMonth: httpRequest.body.daysOfMonth,
        daily: httpRequest.body.daily,
        pets: httpRequest.body.pets
      })
    })
  })

  describe('Validations', () => {
    it('Should return 400 (BadRequest) if validation returns error', async () => {
      const { sut, validationStub } = makeSut()
      jest.spyOn(validationStub, 'validate').mockReturnValue(new Error())
      const httpResponse = await sut.handle(httpRequest)
      expect(httpResponse).toEqual(badRequest(new Error()))
    })

    it('Should call validation with correct values', async () => {
      const { sut, validationStub } = makeSut()
      const validationSpy = jest.spyOn(validationStub, 'validate')
      await sut.handle(httpRequest)
      expect(validationSpy).toHaveBeenCalledWith(httpRequest.body)
    })
  })

  it('Should return 201 (Created) if valid data is provided', async () => {
    const { sut } = makeSut()
    const httpResponse = await sut.handle(httpRequest)
    expect(httpResponse).toEqual(create({
      id: expect.any(String),
      tagId: expect.any(String),
      guardianId: expect.any(String),
      title: 'any_title',
      description: 'any_description',
      note: 'any_note',
      startAt: new Date('2024-04-04T15:00:00Z'),
      endAt: new Date('2025-04-04T17:00:00Z'),
      daysOfWeek: [],
      daysOfMonth: [],
      daily: false,
      pets: [{
        id: expect.any(String),
        specieAlias: 'any_specie_alias',
        guardianId: expect.any(String),
        specieId: expect.any(String),
        petName: 'any_pet_name',
        gender: 'M',
        breedAlias: 'any_breed_alias',
        breedId: expect.any(String),
        sizeId: expect.any(String),
        castrated: false,
        dateOfBirth: new Date('2000-11-23T02:00:00.000Z'),
        image: ''
      }]
    }))
  })
})
