import { type AddGuardianRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type AddPet } from '@/domain/use-cases'
import { type Guardian } from '@/tests/utils/types'

const makeFakeGuardianData = (): Guardian => {
  const fakeGuardian = {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email',
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

const mockFakePetAdded = (): Omit<AddPet.Result, 'isSuccess' | 'error'> => {
  return {
    id: 'any_id',
    specie: {
      id: 'any_id',
      name: 'any_name'
    }
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
    accessToken: 'any_hashed_token',
    verificationToken: 'any_verification_token',
    verificationTokenCreatedAt: new Date()
  }
}

export {
  makeFakeGuardianData,
  mockFakeGuardianAdded,
  mockFakeGuardianLoaded,
  mockFakePetAdded
}
