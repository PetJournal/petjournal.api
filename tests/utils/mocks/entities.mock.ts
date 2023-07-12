import { type AddGuardianRepository, type LoadGuardianByIdRepository } from '@/data/protocols'
import { type Guardian } from '../types'

const mockGuardianEntity: Guardian = {
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

const mockFakeGuardianAdded = (): Exclude<AddGuardianRepository.Result, undefined> => {
  return {
    id: mockGuardianEntity.id,
    firstName: mockGuardianEntity.firstName,
    lastName: mockGuardianEntity.lastName,
    email: mockGuardianEntity.email,
    phone: mockGuardianEntity.phone
  }
}

const mockFakeGuardianLoaded = (): Exclude<LoadGuardianByIdRepository.Result, undefined> => {
  return {
    id: mockGuardianEntity.id,
    firstName: mockGuardianEntity.firstName,
    lastName: mockGuardianEntity.lastName,
    email: mockGuardianEntity.email,
    password: mockGuardianEntity.password,
    phone: mockGuardianEntity.phone,
    accessToken: mockGuardianEntity.accessToken,
    verificationToken: mockGuardianEntity.verificationToken,
    verificationTokenCreatedAt: new Date()
  }
}

export {
  mockGuardianEntity,
  mockFakeGuardianAdded,
  mockFakeGuardianLoaded
}
