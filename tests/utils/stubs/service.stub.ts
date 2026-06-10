import {
  mockFakeGuardianAdded,
  mockFakeGuardianLoaded,
  mockFakePetAdded,
  mockFakeCatBreedsLoaded,
  mockFakeDogBreedsLoaded,
  mockFakePetByGuardianIdLoaded,
  mockFakePetByIdLoaded,
  mockFakePetUpdated,
  mockFakePetByIdDeleted,
  mockFakeGuardianUpdated,
  mockFakeGuardianImageUpdated
} from '@/tests/utils'
import {
  type EmailService,
  type AddGuardianRepository,
  type HashComparer,
  type HashGenerator,
  type LoadGuardianByEmailRepository,
  type LoadGuardianByIdRepository,
  type TokenDecoder,
  type TokenGenerator,
  type UpdateAccessTokenRepository,
  type UpdateVerificationTokenRepository,
  type UpdateGuardianPasswordRepository,
  type AddPetRepository,
  type LoadSpecieByIdRepository,
  type LoadSpecieByNameRepository,
  type LoadBreedByNameRepository,
  type LoadSizeByNameRepository,
  type LoadCatBreedsRepository,
  type LoadDogBreedsRepository,
  type LoadPetByGuardianIdRepository,
  type LoadPetByIdRepository,
  type UpdatePetRepository,
  type DeletePetByIdRepository,
  type UpdateEmailConfirmationRepository,
  type FileStorage,
  type DeleteFileStorage,
  type AddTagRepository,
  type LoadTagByIdRepository,
  type UpdateTagRepository,
  type LoadTagsRepository,
  type DeleteTagRepository,
  type AddEventRepository,
  type LoadEventByDateRepository,
  type AddManyEventsRepository,
  type AddSchedulerRepository,
  type DeleteSchedulerByIdRepository,
  type LoadSettingsRepository,
  type UpdateSettingsRepository,
  type LoadNextTasksByPetIdAndTagIdRepository,
  type UpdateGuardianImageRepository,
  type UpdateGuardianRepository,
  type LoadSchedulerByIdRepository,
  type DeleteEventsBySchedulerIdRepository
} from '@/data/protocols'
import { type LoadCatSizesRepository } from '@/data/protocols/db/size/load-cat-sizes-repository'
import { type LoadDogSizesRepository } from '@/data/protocols/db/size/load-dog-sizes-repository'
import { type EventsGenerator } from '@/data/protocols/service'

const mockHashService = {
  hashedValue: 'hashed_value'
}

const mockTokenService = {
  anyToken: 'any_token',
  validId: { sub: 'valid_id' }
}

const makeFakeGuardianRepository = ():
AddGuardianRepository &
LoadGuardianByEmailRepository &
LoadGuardianByIdRepository &
UpdateAccessTokenRepository &
UpdateGuardianPasswordRepository &
UpdateVerificationTokenRepository &
UpdateEmailConfirmationRepository &
UpdateGuardianImageRepository &
UpdateGuardianRepository => {
  class GuardianRepositoryStub implements
  AddGuardianRepository,
  LoadGuardianByEmailRepository,
  LoadGuardianByIdRepository,
  UpdateAccessTokenRepository,
  UpdateGuardianPasswordRepository,
  UpdateVerificationTokenRepository,
  UpdateEmailConfirmationRepository,
  UpdateGuardianImageRepository,
  UpdateGuardianRepository {
    async add (guardian: AddGuardianRepository.Params): Promise<AddGuardianRepository.Result> {
      return mockFakeGuardianAdded()
    }

    async loadByEmail (email: string): Promise<LoadGuardianByEmailRepository.Result> {
      return mockFakeGuardianLoaded()
    }

    async loadById (id: string): Promise<LoadGuardianByIdRepository.Result> {
      return mockFakeGuardianLoaded()
    }

    async updateAccessToken (authentication: UpdateAccessTokenRepository.Params): Promise<boolean> {
      return true
    }

    async updatePassword (userData: UpdateGuardianPasswordRepository.Params): Promise<UpdateGuardianPasswordRepository.Result> {
      return true
    }

    async updateVerificationToken (credentials: UpdateVerificationTokenRepository.Params): Promise<UpdateVerificationTokenRepository.Result> {
      return true
    }

    async updateEmailConfirmation (userId: UpdateEmailConfirmationRepository.Params): Promise<UpdateEmailConfirmationRepository.Result> {
      return true
    }

    async updateImage (params: UpdateGuardianImageRepository.Params): Promise<UpdateGuardianImageRepository.Result> {
      return mockFakeGuardianImageUpdated()
    }

    async update (params: UpdateGuardianRepository.Params): Promise<UpdateGuardianRepository.Result> {
      return mockFakeGuardianUpdated()
    }
  }
  return new GuardianRepositoryStub()
}

const makeFakePetRepository = ():
AddPetRepository &
LoadPetByGuardianIdRepository &
LoadPetByIdRepository &
UpdatePetRepository &
DeletePetByIdRepository => {
  class PetRepositoryStub implements
  AddPetRepository,
  LoadPetByGuardianIdRepository,
  LoadPetByIdRepository,
  UpdatePetRepository,
  DeletePetByIdRepository {
    async add (petData: AddPetRepository.Params): Promise<AddPetRepository.Result> {
      return mockFakePetAdded()
    }

    async update (params: UpdatePetRepository.Params): Promise<UpdatePetRepository.Result> {
      return mockFakePetUpdated()
    }

    async loadByGuardianId (guardianId: string): Promise<LoadPetByGuardianIdRepository.Result> {
      return mockFakePetByGuardianIdLoaded()
    }

    async loadById (params: LoadPetByIdRepository.Params): Promise<LoadPetByIdRepository.Result> {
      return mockFakePetByIdLoaded()
    }

    async deleteById (petId: DeletePetByIdRepository.Params): Promise<DeletePetByIdRepository.Result> {
      return mockFakePetByIdDeleted()
    }
  }

  return new PetRepositoryStub()
}

const makeFakeSpecieRepository = ():
LoadSpecieByIdRepository &
LoadSpecieByNameRepository => {
  class SpecieRepositoryStub implements
  LoadSpecieByIdRepository,
  LoadSpecieByNameRepository {
    async loadById (specieData: LoadSpecieByIdRepository.Params): Promise<LoadSpecieByIdRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name'
      }
    }

    async loadByName (specieData: LoadSpecieByNameRepository.Params): Promise<LoadSpecieByNameRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name'
      }
    }
  }

  return new SpecieRepositoryStub()
}

const makeFakeBreedRepository = (): LoadBreedByNameRepository => {
  class LoadBreedByNameRepositoryStub implements LoadBreedByNameRepository {
    async loadByName (breedName: LoadBreedByNameRepository.Params): Promise<LoadBreedByNameRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name',
        specieId: 'any_id'
      }
    }
  }
  return new LoadBreedByNameRepositoryStub()
}

const makeFakeSizeRepository = (): LoadSizeByNameRepository => {
  class LoadSizeByNameRepositoryStub implements LoadSizeByNameRepository {
    async loadByName (size: LoadSizeByNameRepository.Params): Promise<LoadSizeByNameRepository.Result> {
      return {
        id: 'any_id',
        name: 'any_name',
        specieId: 'any_id'
      }
    }
  }
  return new LoadSizeByNameRepositoryStub()
}

const makeFakeLoadCatBreedRepository = (): LoadCatBreedsRepository => {
  class LoadCatBreedRepositoryStub implements LoadCatBreedsRepository {
    async loadCatBreeds (): Promise<LoadCatBreedsRepository.Result> {
      return mockFakeCatBreedsLoaded()
    }
  }
  return new LoadCatBreedRepositoryStub()
}

const makeFakeLoadDogBreedRepository = (): LoadDogBreedsRepository => {
  class LoadDogBreedsRepositoryStub implements LoadDogBreedsRepository {
    async loadDogBreeds (): Promise<LoadDogBreedsRepository.Result> {
      return mockFakeDogBreedsLoaded()
    }
  }
  return new LoadDogBreedsRepositoryStub()
}

const makeFakeHashService = (): HashGenerator & HashComparer => {
  class HashServiceStub implements HashGenerator, HashComparer {
    async compare (input: HashComparer.Params): Promise<boolean> {
      return true
    }

    async encrypt (input: HashGenerator.Params): Promise<string> {
      return mockHashService.hashedValue
    }
  }
  return new HashServiceStub()
}

const makeFakeTokenService = (): TokenGenerator & TokenDecoder => {
  class TokenServiceStub implements TokenGenerator, TokenDecoder {
    async generate (payload: any): Promise<string> {
      return mockTokenService.anyToken
    }

    async decode (token: TokenDecoder.Params): Promise<TokenDecoder.Result> {
      return mockTokenService.validId
    }
  }
  return new TokenServiceStub()
}

const makeFakeEmailService = (): EmailService => {
  class EmailServiceStub implements EmailService {
    async send (options: EmailService.Options): Promise<boolean> {
      return await Promise.resolve(true)
    }
  }
  return new EmailServiceStub()
}

const makeFakeLoadCatSizesRepository = (): LoadCatSizesRepository => {
  class LoadCatSizesRepositoryStub implements LoadCatSizesRepository {
    async loadCatSizes (): Promise<LoadCatSizesRepository.Result> {
      return [
        {
          name: 'any_name'
        }
      ]
    }
  }
  return new LoadCatSizesRepositoryStub()
}

const makeFakeLoadDogSizesRepository = (): LoadDogSizesRepository => {
  class LoadDogSizesRepositoryStub implements LoadDogSizesRepository {
    async loadDogSizes (): Promise<LoadDogSizesRepository.Result> {
      return [
        {
          name: 'any_name'
        }
      ]
    }
  }
  return new LoadDogSizesRepositoryStub()
}

const makeFakeLoadPetByGuardianIdRepository = (): LoadPetByGuardianIdRepository => {
  class LoadPetByGuardianIdRepositoryStub implements LoadPetByGuardianIdRepository {
    async loadByGuardianId (guardianId: string): Promise<LoadPetByGuardianIdRepository.Result> {
      return mockFakePetByGuardianIdLoaded()
    }
  }
  return new LoadPetByGuardianIdRepositoryStub()
}

const makeFakeLoadPetByIdRepository = (): LoadPetByIdRepository => {
  class LoadPetByGuardianIdRepositoryStub implements LoadPetByIdRepository {
    async loadById (params: LoadPetByIdRepository.Params): Promise<LoadPetByIdRepository.Result> {
      return mockFakePetByIdLoaded()
    }
  }
  return new LoadPetByGuardianIdRepositoryStub()
}

const makeFakeFileStorage = (): FileStorage & DeleteFileStorage => {
  class FileStorageStub implements FileStorage {
    async save (data: FileStorage.Params): Promise<FileStorage.Result> {
      return 'any_url'
    }

    async delete (fileUrlOrPath: DeleteFileStorage.Params): Promise<DeleteFileStorage.Result> {}
  }

  return new FileStorageStub()
}

const makeFakeTagRepository = (): AddTagRepository & LoadTagByIdRepository & UpdateTagRepository & LoadTagsRepository & DeleteTagRepository => {
  class TagRepositoryStub implements AddTagRepository, LoadTagByIdRepository, UpdateTagRepository, LoadTagsRepository, DeleteTagRepository {
    async add (params: AddTagRepository.Params): Promise<AddTagRepository.Result> {
      return {
        id: 'any_id',
        guardianId: 'any_guardian_id',
        name: 'any_name',
        color: 'any_color'
      }
    }

    async loadById (tagId: LoadTagByIdRepository.Param): Promise<LoadTagByIdRepository.Result> {
      return {
        id: 'any_id',
        guardianId: 'any_guardian_id',
        name: 'any_name',
        color: 'any_color'
      }
    }

    async update (param: UpdateTagRepository.Params): Promise<UpdateTagRepository.Result> {
      return {
        id: 'any_id',
        guardianId: 'any_guardian_id',
        name: 'updated_name',
        color: 'any_color'
      }
    }

    async loadAll (): Promise<LoadTagsRepository.Result> {
      return [{
        id: 'any_id',
        guardianId: 'any_guardian_id',
        name: 'any_name',
        color: 'any_color'
      }]
    }

    async deleteById (tagId: DeleteTagRepository.Param): Promise<DeleteTagRepository.Result> {
      return true
    }
  }
  return new TagRepositoryStub()
}

const makeFakeEventRepository = (): AddEventRepository & LoadEventByDateRepository & AddManyEventsRepository & LoadNextTasksByPetIdAndTagIdRepository & DeleteEventsBySchedulerIdRepository => {
  class EventRepositoryStub implements AddEventRepository, LoadEventByDateRepository, AddManyEventsRepository, LoadNextTasksByPetIdAndTagIdRepository, DeleteEventsBySchedulerIdRepository {
    async add (params: AddEventRepository.Params): Promise<AddEventRepository.Result> {
      return {
        id: 'any_id',
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')
      }
    }

    async loadByDate (params: LoadEventByDateRepository.Params): Promise<LoadEventByDateRepository.Result> {
      return {
        schedulerId: 'any_scheduler_id',
        start: new Date('2025-06-01T10:30:00Z'),
        end: new Date('2025-07-01T11:30:00Z')
      }
    }

    async addMany (params: AddManyEventsRepository.Params): Promise<AddManyEventsRepository.Result> {
      return true
    }

    async loadByPetIdAndTagId (params: LoadNextTasksByPetIdAndTagIdRepository.Params): Promise<LoadNextTasksByPetIdAndTagIdRepository.Result> {
      return {
        page: 1,
        limit: 10,
        totalPages: 1,
        events: [{
          id: 'any_id',
          start: new Date('2025-12-13T10:30:00Z'),
          end: new Date('2025-12-14T10:30:00Z'),
          schedulerId: 'any_scheduler_id',
          scheduler: {
            id: 'any_id',
            title: 'any_title',
            description: 'any_description',
            note: 'any_note',
            startAt: new Date('2025-12-13T10:30:00Z'),
            endAt: new Date('2025-12-14T10:30:00Z'),
            daysOfWeek: [],
            daysOfMonth: [],
            daily: false,
            tag: {
              name: 'any_tag',
              color: 'any_color'
            },
            pets: [{
              id: 'any_id',
              image: 'any_image'
            }]
          }
        }]
      }
    }

    async delete (params: DeleteEventsBySchedulerIdRepository.Params): Promise<DeleteEventsBySchedulerIdRepository.Result> {
      return true
    }
  }
  return new EventRepositoryStub()
}

const makeFakeSchedulerRepository = (): AddSchedulerRepository & DeleteSchedulerByIdRepository & LoadSchedulerByIdRepository => {
  class SchedulerRepositoryStub implements AddSchedulerRepository, DeleteSchedulerByIdRepository, LoadSchedulerByIdRepository {
    async add (params: AddSchedulerRepository.Params): Promise<AddSchedulerRepository.Result> {
      return {
        id: 'any_id',
        tagId: 'any_tag_id',
        guardianId: 'any_guardian_id',
        title: 'any_title',
        description: 'any_description',
        note: 'any_note',
        startAt: new Date('2024-04-04T15:00:00Z'),
        endAt: new Date('2025-04-04T17:00:00Z'),
        daysOfWeek: [],
        daysOfMonth: [],
        daily: false,
        pets: [{
          id: 'any_id',
          specieAlias: 'any_specie_alias',
          guardianId: 'any_guardian_id',
          specieId: 'any_specie_id',
          petName: 'any_pet_name',
          gender: 'M',
          breedAlias: 'any_breed_alias',
          breedId: 'any_breed_id',
          sizeId: 'any_size_id',
          castrated: false,
          dateOfBirth: new Date('2000-11-23T02:00:00.000Z'),
          image: ''
        }]
      }
    }

    async delete (params: DeleteSchedulerByIdRepository.Params): Promise<DeleteSchedulerByIdRepository.Result> {
      return true
    }

    async load (params: LoadSchedulerByIdRepository.Params): Promise<LoadSchedulerByIdRepository.Result> {
      return {
        id: 'any_scheduler_id',
        tagId: 'any_tag_id',
        guardianId: 'any_guardian_id',
        title: 'any_title',
        description: 'any_description',
        note: 'any_note',
        startAt: new Date('2024-04-04T15:00:00Z'),
        endAt: new Date('2025-04-04T17:00:00Z'),
        daysOfWeek: [],
        daysOfMonth: [],
        daily: false,
        pets: [{
          id: 'any_id',
          petName: 'any_pet_name',
          image: ''
        }]
      }
    }
  }
  return new SchedulerRepositoryStub()
}

const makeFakeEventsGenerator = (): EventsGenerator => {
  class EventsGeneratorStub implements EventsGenerator {
    async generate (params: EventsGenerator.Params): Promise<EventsGenerator.Result> {
      return {
        isSuccess: true,
        data: {
          schedulerId: 'any_scheduler_id',
          start: new Date('2024-04-04T15:00:00Z'),
          end: new Date('2025-04-04T17:00:00Z')
        }
      }
    }
  }
  return new EventsGeneratorStub()
}

const makeFakeSettingsRepository = (): LoadSettingsRepository & UpdateSettingsRepository => {
  class SettingsRepositoryStub implements LoadSettingsRepository, UpdateSettingsRepository {
    async loadAll (guardianId: string): Promise<LoadSettingsRepository.Result> {
      return [
        {
          notificationEmail: false,
          notificationMobile: false
        }
      ]
    }

    async update (params: UpdateSettingsRepository.Params): Promise<UpdateSettingsRepository.Result> {
      return {
        guardianId: 'any_id',
        notificationEmail: false,
        notificationMobile: false
      }
    }
  }

  return new SettingsRepositoryStub()
}

export {
  mockHashService,
  mockTokenService,
  makeFakeGuardianRepository,
  makeFakePetRepository,
  makeFakeLoadPetByGuardianIdRepository,
  makeFakeLoadPetByIdRepository,
  makeFakeSpecieRepository,
  makeFakeBreedRepository,
  makeFakeLoadCatBreedRepository,
  makeFakeLoadDogBreedRepository,
  makeFakeHashService,
  makeFakeEmailService,
  makeFakeTokenService,
  makeFakeLoadCatSizesRepository,
  makeFakeLoadDogSizesRepository,
  makeFakeSizeRepository,
  makeFakeFileStorage,
  makeFakeTagRepository,
  makeFakeEventRepository,
  makeFakeSchedulerRepository,
  makeFakeEventsGenerator,
  makeFakeSettingsRepository
}
