import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'
import { makeFakeGuardianData } from '@/tests/utils'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): GuardianAccountRepository => {
  return new GuardianAccountRepository()
}

describe('GuardianAccountRepository', () => {
  describe('AddGuardianRepository', () => {
    it('Should return a guardian account on success ', async () => {
      const sut = makeSut()
      const { accessToken, ...guardianData } = makeFakeGuardianData()
      const { password, verificationTokenCreatedAt, verificationToken, ...guardianDataDb } = guardianData

      const guardian = await sut.add(guardianData)

      expect(guardian).toMatchObject(guardianDataDb)
    })

    it('Should not return a guardian account if duplicated email or phone is provided', async () => {
      const sut = makeSut()
      const firstAttempt = await sut.add(makeFakeGuardianData())
      const secondAttempt = await sut.add(makeFakeGuardianData())
      expect(firstAttempt).toBeTruthy()
      expect(secondAttempt).toBeFalsy()
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

      expect(guardian).toBeFalsy()
    })
  })

  describe('LoadAccountByIdRepository', () => {
    it('Should return a guardian account on success', async () => {
      const sut = makeSut()
      const guardianData = makeFakeGuardianData({ withId: true })
      await sut.add(guardianData)

      const guardianByEmail = await sut.loadByEmail(guardianData.email) as any
      const guardianById = await sut.loadById(guardianByEmail.id) as any

      expect(guardianById).toMatchObject(guardianData)
    })

    it('Should not return a guardian account if invalid id is provided', async () => {
      const sut = makeSut()
      const id = 'invalid_id'

      const guardian = await sut.loadById(id)

      expect(guardian).toBeFalsy()
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

      expect(guardian.accessToken).not.toBeFalsy()
      expect(guardian.accessToken).toBe(authenticationData.token)
    })
  })

  describe('UpdateGuardianPasswordRepository', () => {
    it('Should update the account successfully', async () => {
      const sut = makeSut()
      const guardianData = makeFakeGuardianData()

      await sut.add(guardianData)
      let guardian = await sut.loadByEmail(guardianData.email) as any

      const authenticationData = { id: guardian.id, password: 'updated_password' }
      const response = await sut.updatePassword(authenticationData)

      guardian = await sut.loadByEmail(guardianData.email)

      expect(response).toBeTruthy()
      expect(guardian.password).toBe(authenticationData.password)
    })

    it('Should fail when there is no id', async () => {
      const sut = makeSut()

      const authenticationData = { id: 'invalid_id', password: 'updated_password' }
      const response = await sut.updatePassword(authenticationData)

      expect(response).toBeFalsy()
    })
  })
})
