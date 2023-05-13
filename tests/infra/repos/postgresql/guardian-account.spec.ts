import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import { type Guardian } from '@prisma/client'

beforeEach(() => { PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): GuardianAccountRepository => {
  return new GuardianAccountRepository()
}

const makeFakeGuardianData = (): Omit<Guardian, 'id'> => ({
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email',
  password: 'valid_password',
  phone: 'valid_phone',
  accessToken: null,
  isPrivacyPolicyAccepted: true
})

describe('GuardianAccountRepository', () => {
  describe('AddGuardianRepository', () => {
    it('Should return a guardian account on success ', async () => {
      const sut = makeSut()
      const isValid = await sut.add(makeFakeGuardianData())
      expect(isValid).toBe(true)
    })

    it('Should not return a guardian account if duplicated email or phone is provided', async () => {
      const sut = makeSut()
      const firstAttempt = await sut.add(makeFakeGuardianData())
      const secondAttempt = await sut.add(makeFakeGuardianData())
      expect(firstAttempt).toBe(true)
      expect(secondAttempt).toBe(false)
    })
  })
  describe('LoadAccountByEmailRepository', () => {
    it('Should return a guardian account on success', async () => {
      const sut = makeSut()
      const guardianData = makeFakeGuardianData()
      await sut.add(guardianData)

      const guardian = await sut.loadByEmail(guardianData.email)

      expect(guardian).toMatchObject(guardianData)
    })

    it('Should not return a guardian account if invalid email is provided', async () => {
      const sut = makeSut()
      const email = 'invalid_email:mail.com'

      const guardian = await sut.loadByEmail(email)

      expect(guardian).toBeNull()
    })
  })

  describe('LoadAccountByIdRepository', () => {
    it('Should return a guardian account on success', async () => {
      const sut = makeSut()
      const guardianData = makeFakeGuardianData()
      await sut.add(guardianData)

      const guardianByEmail = await sut.loadByEmail(guardianData.email) as any
      const guardianById = await sut.loadById(guardianByEmail.id) as any

      expect(guardianById).toMatchObject(guardianData)
    })

    it('Should not return a guardian account if invalid id is provided', async () => {
      const sut = makeSut()
      const id = 'invalid_id'

      const guardian = await sut.loadById(id)

      expect(guardian).toBeNull()
    })
  })

  describe('UpdateAccessTokenRepository', () => {
    it('Should update the account successfully', async () => {
      const sut = makeSut()
      const guardianData = makeFakeGuardianData()

      await sut.add(guardianData)
      let guardian = await sut.loadByEmail(guardianData.email) as any

      const authenticationData = { id: guardian.id, token: 'valid_token' }
      await sut.updateAccessToken(authenticationData)

      guardian = await sut.loadByEmail(guardianData.email)

      expect(guardian.accessToken).not.toBeNull()
      expect(guardian.accessToken).toBe(authenticationData.token)
    })
  })
})
