
import { type AddGuardianRepository } from '@/data/protocols'
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(() => { PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): GuardianAccountRepository => {
  return new GuardianAccountRepository()
}

const makeFakeGuardianData = (): AddGuardianRepository.Params => ({
  firstName: 'valid_first_name',
  lastName: 'valid_last_name',
  email: 'valid_email',
  password: 'valid_password',
  phone: 'valid_phone',
  isPrivacyPolicyAccepted: true
})

describe('GuardianAccountRepository', () => {
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

  describe('LoadAccountByEmailRepository', () => {
    it('Should return a guardian account on success', async () => {
      const sut = makeSut()
      const guardianData = makeFakeGuardianData()
      await sut.add(guardianData)

      const guardian = await sut.loadByEmail(guardianData.email)

      expect(guardian).toEqual({ ...guardianData, id: 1 })
    })
  })
})
