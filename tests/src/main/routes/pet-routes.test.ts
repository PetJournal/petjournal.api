import app from '@/main/config/app'
import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'
import request from 'supertest'

beforeEach(async () => { await PrismaHelper.connect() })

afterEach(async () => { await PrismaHelper.disconnect() })

const makeSetup = async (): Promise<{ accessToken: string }> => {
  await request(app)
    .post('/api/signup')
    .send({
      firstName: 'John',
      lastName: 'Doe',
      email: 'johndoe@email.com',
      password: 'Test@123',
      passwordConfirmation: 'Test@123',
      phone: '11987654321',
      isPrivacyPolicyAccepted: true
    })

  const { body } = await request(app)
    .post('/api/login')
    .send({
      email: 'johndoe@email.com',
      password: 'Test@123'
    })

  await prisma.specie.createMany({
    data: [
      { name: 'Cachorro' },
      { name: 'Outros' }
    ]
  })

  return body
}

describe('POST - /api/pet Route', () => {
  it.each([
    ['Cachorro', { status: 201, specie: { name: 'Cachorro' }, specieAlias: null }],
    ['Inseto', { status: 201, specie: { name: 'Outros' }, specieAlias: 'Inseto' }],
    ['Cachorro', { status: 201, specie: { name: 'Cachorro' }, specieAlias: null }]
  ])("When Specie is '%s' and Specie Alias is '%s' should return '%s' when the pet is successfully created", async (specieName, res) => {
    const { accessToken } = await makeSetup()
    const response = await request(app)
      .post('/api/pet')
      .set('Authorization', accessToken)
      .send({
        specieName
      })

    expect(response.status).toBe(res.status)
    expect(response.body.specie.name).toBe(res.specie.name)
  })
})
