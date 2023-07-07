import { type AddGuardianRepository, type LoadGuardianByIdRepository } from '@/data/protocols'

const mockFakeGuardianAdded = (): Exclude<AddGuardianRepository.Result, undefined> => {
  return {
    id: 'any_id',
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@mail.com',
    phone: 'any_phone'
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
  mockFakeGuardianAdded,
  mockFakeGuardianLoaded
}
