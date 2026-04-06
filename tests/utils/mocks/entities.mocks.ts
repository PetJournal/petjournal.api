import {
  type AddPetRepository,
  type UpdatePetRepository,
  type AddGuardianRepository,
  type LoadGuardianByIdRepository,
  type LoadSpecieByIdRepository,
  type LoadBreedByNameRepository,
  type LoadSizeByNameRepository,
  type LoadCatBreedsRepository,
  type LoadDogBreedsRepository,
  type LoadPetByGuardianIdRepository,
  type LoadPetByIdRepository,
  type DeletePetByIdRepository,
  type UpdateGuardianImageRepository,
  type UpdateGuardianRepository
} from '@/data/protocols'
import { type AppointPet } from '@/domain/use-cases'
import { type Guardian } from '@/tests/utils/types'

const makeFakeGuardianData = (): Guardian => {
  const fakeGuardian = {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    phone: 'any_phone',
    accessToken: 'any_token',
    verificationToken: 'any_verification_token',
    verificationTokenCreatedAt: new Date()
  }

  return fakeGuardian
}

const mockFakeGuardianAdded = (): Exclude<AddGuardianRepository.Result, undefined> => {
  return {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    phone: 'any_phone'
  }
}

const mockFakeGuardianImageUpdated = (): Exclude<UpdateGuardianImageRepository.Result, undefined> => {
  return {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    phone: 'any_phone',
    image: 'any_image'
  }
}

const mockFakeGuardianUpdated = (): Exclude<UpdateGuardianRepository.Result, undefined> => {
  return {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    phone: 'any_phone',
    image: ''
  }
}

const mockFakePetAdded = (): AddPetRepository.Result => {
  return {
    id: 'any_id',
    guardian: mockFakeGuardianAdded(),
    specie: mockFakeSpecieAdded(),
    specieAlias: 'any_specie_alias',
    petName: 'any_pet_name',
    gender: 'M',
    breed: mockFakeBreedAdded(),
    breedAlias: 'any_breed_alias',
    size: mockFakeSizeAdded(),
    castrated: false,
    dateOfBirth: new Date(2000, 10, 23)
  }
}

const mockFakePetByGuardianIdLoaded = (): Exclude<LoadPetByGuardianIdRepository.Result, undefined> => {
  return [{
    id: 'any_id',
    guardianId: 'any_guardian_id',
    specie: {
      id: 'any_id',
      name: 'any_name'
    },
    specieAlias: '',
    petName: 'any_pet_name',
    gender: 'any_pet_gender',
    breedAlias: '',
    breed: {
      id: 'any_id',
      name: 'any_name'
    },
    size: {
      id: 'any_id',
      name: 'any_name'
    },
    castrated: false
  }]
}

const mockFakePetByIdLoaded = (): Exclude<LoadPetByIdRepository.Result, null> => {
  return {
    id: 'any_id',
    guardianId: 'any_guardian_id',
    specie: {
      id: 'any_id',
      name: 'any_name'
    },
    specieAlias: '',
    petName: 'any_pet_name',
    gender: 'any_pet_gender',
    breedAlias: '',
    breed: {
      id: 'any_id',
      name: 'any_name'
    },
    size: {
      id: 'any_id',
      name: 'any_name'
    },
    castrated: false,
    dateOfBirth: new Date(2000, 10, 23),
    image: 'any_image_url'
  }
}

const mockFakePetByIdDeleted = (): DeletePetByIdRepository.Result => {
  return true
}

const mockFakePetUpdated = (): UpdatePetRepository.Result => {
  return {
    id: 'any_id',
    guardian: mockFakeGuardianAdded(),
    specie: mockFakeSpecieAdded(),
    specieAlias: 'any_specie_alias',
    petName: 'any_pet_name',
    gender: 'M',
    breed: mockFakeBreedAdded(),
    breedAlias: 'any_breed_alias',
    size: mockFakeSizeAdded(),
    castrated: false,
    dateOfBirth: new Date(2000, 10, 23),
    image: 'any_image'
  }
}

const mockFakeAppointPet = (): AppointPet.Result => {
  return {
    isSuccess: true,
    data: {
      specie: mockFakeSpecieAdded(),
      specieAlias: 'any_specie_alias',
      breed: mockFakeBreedAdded(),
      breedAlias: 'any_breed_alias',
      size: mockFakeSizeAdded(),
      castrated: false
    }
  }
}

const mockFakeSpecieAdded = (): Exclude<LoadSpecieByIdRepository.Result, undefined> => {
  return {
    id: 'any_id',
    name: 'any_name'
  }
}

const mockFakeCatBreedsLoaded = (): LoadCatBreedsRepository.Result => {
  return [{
    name: 'any_name'
  }]
}

const mockFakeDogBreedsLoaded = (): LoadDogBreedsRepository.Result => {
  return [{
    name: 'any_name'
  }]
}

const mockFakeBreedAdded = (): Exclude<LoadBreedByNameRepository.Result, undefined> => {
  return {
    id: 'any_id',
    name: 'any_name',
    specieId: 'any_id'
  }
}

const mockFakeSizeAdded = (): Exclude<LoadSizeByNameRepository.Result, undefined> => {
  return {
    id: 'any_id',
    name: 'any_name',
    specieId: 'any_id'
  }
}

const mockFakeGuardianLoaded = (): Exclude<LoadGuardianByIdRepository.Result, undefined> => {
  return {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    password: 'any_hashed_password',
    phone: 'any_phone',
    image: 'any_image',
    accessToken: 'any_hashed_token',
    verificationToken: 'any_verification_token',
    verificationTokenCreatedAt: new Date(),
    emailConfirmation: true
  }
}

export {
  makeFakeGuardianData,
  mockFakeGuardianAdded,
  mockFakeGuardianUpdated,
  mockFakeGuardianImageUpdated,
  mockFakeGuardianLoaded,
  mockFakePetAdded,
  mockFakePetByGuardianIdLoaded,
  mockFakePetByIdLoaded,
  mockFakePetUpdated,
  mockFakePetByIdDeleted,
  mockFakeSpecieAdded,
  mockFakeCatBreedsLoaded,
  mockFakeDogBreedsLoaded,
  mockFakeBreedAdded,
  mockFakeSizeAdded,
  mockFakeAppointPet
}
