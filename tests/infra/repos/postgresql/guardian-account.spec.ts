
import { GuardianAccountRepository } from '@/infra/repos/postgresql/guardian-account-repository'
import { PrismaHelper } from '@/tests/helpers/prisma-helper'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSut = (): GuardianAccountRepository => {
  return new GuardianAccountRepository()
}

describe('GuardianAccountRepository', () => {
  it('Should return a guardian account on success ', async () => {
    const sut = makeSut()
    const guardianData = {
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'any_email@mail.com',
      password: 'valid_password',
      phone: 'valid_phone'
    }
    const isValid = await sut.add(guardianData)
    expect(isValid).toEqual({
      id: 1,
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'any_email@mail.com',
      phone: 'valid_phone'
    })
  })

  it('Should not return a guardian account if duplicated email or phone is provided', async () => {
    const sut = makeSut()
    const guardianData = {
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'any_email@mail.com',
      password: 'valid_password',
      phone: 'valid_phone'
    }
    const firstAttempt = await sut.add(guardianData)
    const secondAttempt = await sut.add(guardianData)
    expect(firstAttempt).toEqual({
      id: 1,
      firstName: 'valid_first_name',
      lastName: 'valid_last_name',
      email: 'any_email@mail.com',
      phone: 'valid_phone'
    })
    expect(secondAttempt).toBe(undefined)
  })
})
