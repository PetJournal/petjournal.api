import { type AddPetRepository, type AddGuardianRepository, type LoadGuardianByIdRepository, type LoadSpecieByIdRepository } from '@/data/protocols'
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

const mockFakePetAdded = (): AddPetRepository.Result => {
  return {
    id: 'any_id',
    guardian: mockFakeGuardianAdded(),
    specie: mockFakeSpecieAdded()
  }
}

const mockFakeSpecieAdded = (): Exclude<LoadSpecieByIdRepository.Result, undefined> => {
  return {
    id: 'any_id',
    name: 'any_name'
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
  mockFakePetAdded,
  mockFakeSpecieAdded
}
