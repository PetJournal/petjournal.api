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

  const cachorro = await prisma.specie.findUnique({ where: { name: 'Cachorro' } })
  const outros = await prisma.specie.findUnique({ where: { name: 'Outros' } })

  await prisma.breed.create({
    data:
      {
        name: 'Afghan Hound',
        specieId: cachorro?.id as string
      }
  })

  await prisma.breed.create({
    data:
      {
        name: 'Sem raça Cachorro',
        specieId: cachorro?.id as string
      }
  })

  await prisma.breed.create({
    data:
      {
        name: 'Sem raça',
        specieId: outros?.id as string
      }
  })

  await prisma.size.create({
    data:
      {
        name: 'Mini (Até 6Kg)',
        specieId: cachorro?.id as string
      }
  })

  await prisma.size.create({
    data:
      {
        name: 'Pequeno (6 à 14Kg)',
        specieId: cachorro?.id as string
      }
  })

  await prisma.size.create({
    data:
      {
        name: 'Sem porte',
        specieId: outros?.id as string
      }
  })

  return body
}

describe('POST - /api/pet Route', () => {
  it.each([
    [{ specieName: 'Cachorro', petName: 'any pet name', gender: 'M', breedName: 'Afghan Hound', size: 'Mini (Até 6Kg)' }, { status: 201, specie: { name: 'Cachorro' }, specieAlias: null, petName: 'any pet name', gender: 'M', breed: { name: 'Afghan Hound' }, size: { name: 'Mini (Até 6Kg)' } }],
    [{ specieName: 'Inseto', petName: 'any pet name', gender: 'M', breedName: 'Sem raça', size: 'Sem porte' }, { status: 201, specie: { name: 'Outros' }, specieAlias: 'Inseto', petName: 'any pet name', gender: 'M', breed: { name: 'Sem raça' }, size: { name: 'Sem porte' } }],
    [{ specieName: 'Cachorro', petName: 'any pet name', gender: 'F', breedName: 'Sem raça Cachorro', size: 'Pequeno (6 à 14Kg)' }, { status: 201, specie: { name: 'Cachorro' }, specieAlias: null, petName: 'any pet name', gender: 'F', breed: { name: 'Sem raça Cachorro' }, size: { name: 'Pequeno (6 à 14Kg)' } }]
  ])("When data is '%s' should return '%s' when the pet is successfully created", async (data, res) => {
    const { accessToken } = await makeSetup()
    const response = await request(app)
      .post('/api/pet')
      .set('Authorization', accessToken)
      .send({
        specieName: data.specieName,
        petName: data.petName,
        gender: data.gender,
        breedName: data.breedName,
        size: data.size
      })

    expect(response.status).toBe(res.status)
    expect(response.body.specie.name).toBe(res.specie.name)
    expect(response.body.specieAlias).toBe(res.specieAlias)
    expect(response.body.petName).toBe(res.petName)
    expect(response.body.breed.name).toBe(res.breed.name)
    expect(response.body.size.name).toBe(res.size.name)
  })
})
