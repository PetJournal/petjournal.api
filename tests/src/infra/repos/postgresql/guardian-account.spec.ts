import { GuardianAccountRepository } from '@/infra/repos/postgresql'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): GuardianAccountRepository => {
  return new GuardianAccountRepository()
}

describe('GuardianAccountRepository', () => {
  const input = {
    firstName: 'any_first_name',
    lastName: 'any_last_name',
    email: 'any_email@gmail.com',
    password: 'any_password',
    phone: 'any_phone',
    accessToken: 'any_token',
    verificationToken: 'any_verification_token'
  }

  describe('AddGuardianRepository', () => {
    it('Should return null if the email is already registered', async () => {
      const sut = makeSut()
      const addSpy = jest.spyOn(sut, 'add')
      const editedInput = { ...input, email: 'johndoe123@gmail.com' }
      const firstAttempt = await sut.add(editedInput)
      const secondAttempt = await sut.add(editedInput)
      expect(firstAttempt).not.toBeNull()
      expect(secondAttempt).toBeNull()
      expect(addSpy).toBeCalledTimes(2)
      expect(addSpy).toHaveBeenNthCalledWith(1, editedInput)
      expect(addSpy).toHaveBeenNthCalledWith(2, editedInput)
    })

    it('Should return null if the phone is already registered', async () => {
      const sut = makeSut()
      const addSpy = jest.spyOn(sut, 'add')
      const editedInput = { ...input, phone: '123456789' }
      const firstAttempt = await sut.add(editedInput)
      const secondAttempt = await sut.add(editedInput)
      expect(firstAttempt).not.toBeNull()
      expect(secondAttempt).toBeNull()
      expect(addSpy).toBeCalledTimes(2)
      expect(addSpy).toHaveBeenNthCalledWith(1, editedInput)
      expect(addSpy).toHaveBeenNthCalledWith(2, editedInput)
    })

    it('Should return a guardian account on success ', async () => {
      const sut = makeSut()
      const guardian = await sut.add(input) as any
      expect(guardian).not.toBeNull()
      expect(guardian.id).toBeDefined()
      expect(guardian).toMatchObject({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone
      })
    })
  })

  describe('CheckUserIdRepository', () => {
    it('Should return false when the userId does not exist', async () => {
      const sut = makeSut()
      const invalidId = 'any_id'
      const response = await sut.checkUserId(invalidId)
      expect(response).toBeFalsy()
    })

    it('Should return true when user is found', async () => {
      const sut = makeSut()
      const { id } = await sut.add(input) as any
      const response = await sut.checkUserId(id)
      expect(response).toBeTruthy()
    })
  })

  describe('LoadAccountByEmailRepository', () => {
    it('Should return null if invalid email is provided', async () => {
      const sut = makeSut()
      const invalidEmail = 'invalid_email:mail.com'
      const guardian = await sut.loadByEmail(invalidEmail)
      expect(guardian).toBeNull()
    })

    it('Should return a guardian account if valid email is provided', async () => {
      const sut = makeSut()
      await sut.add(input)
      const guardian = await sut.loadByEmail(input.email) as any
      expect(guardian).not.toBeNull()
      expect(guardian.id).toBeDefined()
      expect(guardian).toMatchObject({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone
      })
    })
  })

  describe('LoadAccountByIdRepository', () => {
    it('Should return null if invalid email is provided', async () => {
      const sut = makeSut()
      const invalidId = 'invalid_id'
      const guardian = await sut.loadById(invalidId)
      expect(guardian).toBeNull()
    })

    it('Should return a guardian account if valid email is provided', async () => {
      const sut = makeSut()
      const { id } = await sut.add(input) as any
      const guardian = await sut.loadById(id) as any
      expect(guardian).not.toBeNull()
      expect(guardian.id).toBeDefined()
      expect(guardian).toMatchObject({
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        phone: input.phone
      })
    })
  })

  describe('UpdateAccessTokenRepository', () => {
    it('Should return false when invalid userId is provide', async () => {
      const sut = makeSut()
      const response = await sut.updateAccessToken({ userId: 'any_id', token: 'any_token' })
      expect(response).toBeFalsy()
    })

    it('Should return true when accessToken is updated', async () => {
      const sut = makeSut()
      const { id } = await sut.add(input) as any
      const response = sut.updateAccessToken({ userId: id, token: 'any_token' })
      expect(response).toBeTruthy()
    })
  })

  describe('UpdateVerificationTokenRepository', () => {
    it('Should update the verificationToken successfully', async () => {
      const sut = makeSut()
      await sut.add(input)
      let guardian = await sut.loadByEmail(input.email) as any
      const verificationTokenCreatedAt = guardian.verificationTokenCreatedAt

      jest.advanceTimersByTime(1)
      await sut.updateVerificationToken({
        userId: guardian.id,
        token: 'valid_token'
      })

      guardian = await sut.loadByEmail(input.email)

      expect(guardian.verificationToken).toBeTruthy()
      expect(guardian.verificationToken).toBe('valid_token')
      expect(guardian.verificationTokenCreatedAt.getMilliseconds()).toBeGreaterThan(verificationTokenCreatedAt.getMilliseconds())
    })

    it('Should fail when there is no id', async () => {
      const sut = makeSut()

      const authenticationData = { userId: 'invalid_id', password: 'updated_password' }
      const response = await sut.updatePassword(authenticationData)

      expect(response).toBeFalsy()
    })
  })

  describe('UpdatePasswordRepository', () => {
    it('Should return false when invalid userId is provide', async () => {
      const sut = makeSut()
      const response = await sut.updatePassword({ userId: 'any_id', password: 'any_password' })
      expect(response).toBeFalsy()
    })

    it('Should return true when password is updated', async () => {
      const sut = makeSut()
      const { id } = await sut.add(input) as any
      const response = sut.updatePassword({ userId: id, password: 'any_password' })
      expect(response).toBeTruthy()
    })
  })
})
