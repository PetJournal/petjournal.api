import app from '@/main/config/app'
import { PrismaHelper, prisma } from '@/tests/helpers/prisma-helper'
import path from 'node:path'
import request from 'supertest'

const seedDb = async (): Promise<void> => {
  await prisma.specie.createMany({
    data: [
      { name: 'Cachorro' },
      { name: 'Outros' }
    ]
  })

  const { id: dogId } = await prisma.specie.findUniqueOrThrow({ where: { name: 'Cachorro' }, select: { id: true } })
  const { id: otherId } = await prisma.specie.findUniqueOrThrow({ where: { name: 'Outros' }, select: { id: true } })

  const breeds = [
    {
      name: 'Afghan Hound',
      specieId: dogId
    },
    {
      name: 'Sem raça Cachorro',
      specieId: dogId
    },
    {
      name: 'Sem raça',
      specieId: otherId
    }
  ]
  const sizes = [
    {
      name: 'Mini (Até 6Kg)',
      specieId: dogId
    },
    {
      name: 'Pequeno (6 à 14Kg)',
      specieId: dogId
    },
    {
      name: 'Sem porte',
      specieId: otherId
    }
  ]

  await prisma.breed.createMany({ data: breeds })
  await prisma.size.createMany({ data: sizes })
}

const createPetData = (): Array<{ input: any, expected: any }> => [
  {
    input: {
      specieName: 'Cachorro',
      petName: 'any pet name',
      gender: 'M',
      breedName: 'Afghan Hound',
      size: 'Mini (Até 6Kg)',
      dateOfBirth: '2024-06-05T23:40:42.628Z',
      castrated: false,
      image: path.join(__dirname, '..', '..', '..', 'utils', 'images', 'pet.jpg')
    },
    expected: {
      status: 201,
      body: {
        specie: { name: 'Cachorro' },
        specieAlias: null,
        petName: 'any pet name',
        gender: 'M',
        breed: { name: 'Afghan Hound' },
        size: { name: 'Mini (Até 6Kg)' },
        dateOfBirth: '2024-06-05T23:40:42.628Z',
        castrated: false,
        image: expect.any(String)
      }
    }
  },
  {
    input: {
      specieName: 'Inseto',
      petName: 'any pet name',
      gender: 'M',
      breedName: 'Sem raça',
      size: 'Sem porte',
      dateOfBirth: '2000-11-23T02:00:00.000Z',
      castrated: true
    },
    expected: {
      status: 201,
      body: {
        specie: { name: 'Outros' },
        specieAlias: 'Inseto',
        petName: 'any pet name',
        gender: 'M',
        breed: { name: 'Sem raça' },
        size: { name: 'Sem porte' },
        dateOfBirth: '2000-11-23T02:00:00.000Z',
        castrated: false,
        image: ''
      }
    }
  },
  {
    input: {
      specieName: 'Cachorro',
      petName: 'any pet name',
      gender: 'F',
      breedName: 'Sem raça Cachorro',
      size: 'Pequeno (6 à 14Kg)',
      dateOfBirth: '2018-05-10T02:00:00.000Z',
      castrated: false
    },
    expected: {
      status: 201,
      body: {
        specie: { name: 'Cachorro' },
        specieAlias: null,
        petName: 'any pet name',
        gender: 'F',
        breed: { name: 'Sem raça Cachorro' },
        size: { name: 'Pequeno (6 à 14Kg)' },
        dateOfBirth: '2018-05-10T02:00:00.000Z',
        castrated: false,
        image: ''
      }
    }
  }
]

describe('Pet Routes', () => {
  let accessToken = ''
  let fakeUser = {}

  beforeAll(async () => {
    await PrismaHelper.connect()

    const guardian = await PrismaHelper.createGuardian()

    const { body } = await request(app)
      .post('/api/login')
      .send({
        email: 'johndoe@email.com',
        password: 'Test@1234'
      })

    await seedDb()

    accessToken = body.accessToken
    fakeUser = { ...guardian }
    Reflect.deleteProperty(fakeUser, 'password')
    Reflect.deleteProperty(fakeUser, 'accessToken')
    Reflect.deleteProperty(fakeUser, 'verificationToken')
    Reflect.deleteProperty(fakeUser, 'verificationTokenCreatedAt')
  })

  beforeEach(async () => { await prisma.pet.deleteMany() })

  afterAll(async () => { await PrismaHelper.disconnect() })

  describe('POST - /api/pet Route', () => {
    createPetData().forEach(({ input, expected }) => {
      it(`When data is ${JSON.stringify(input)} should return ${JSON.stringify(expected)} when the pet is successfully created`, async () => {
        const response = await request(app)
          .post('/api/pet')
          .set('Authorization', accessToken)
          .field('specieName', input.specieName)
          .field('petName', input.petName)
          .field('gender', input.gender)
          .field('breedName', input.breedName)
          .field('size', input.size)
          .field('dateOfBirth', input.dateOfBirth)
          .field('castrated', input.castrated)
          .attach('image', input.image)

        expect(response.status).toBe(expected.status)
        expect(response.body).toEqual({
          id: expect.any(String),
          guardian: fakeUser,
          specie: {
            id: expect.any(String),
            name: expected.body.specie.name
          },
          specieAlias: expected.body.specieAlias,
          petName: expected.body.petName,
          gender: expected.body.gender,
          breed: {
            id: expect.any(String),
            name: expected.body.breed.name,
            specieId: expect.any(String)
          },
          breedAlias: '',
          size: {
            id: expect.any(String),
            name: expected.body.size.name,
            specieId: expect.any(String)
          },
          castrated: expected.body.castrated,
          dateOfBirth: expected.body.dateOfBirth,
          image: expect.any(String)
        })
      })
    })
  })

  describe('GET - /api/pet Route', () => {
    it('ensure return a list of pets', async () => {
      await request(app)
        .post('/api/pet')
        .set('Authorization', accessToken)
        .field('specieName', 'Cachorro')
        .field('petName', 'any pet name')
        .field('gender', 'M')
        .field('breedName', 'Afghan Hound')
        .field('size', 'Mini (Até 6Kg)')
        .field('dateOfBirth', '2024-06-05T23:40:42.628Z')
        .field('castrated', true)

      const response = await request(app)
        .get('/api/pet')
        .set('Authorization', accessToken)
        .send()

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual([{
        id: expect.any(String),
        guardianId: expect.any(String),
        specie: {
          id: expect.any(String),
          name: 'Cachorro'
        },
        specieAlias: null,
        petName: 'any pet name',
        gender: 'M',
        breedAlias: '',
        breed: {
          id: expect.any(String),
          name: 'Afghan Hound'
        },
        size: {
          id: expect.any(String),
          name: 'Mini (Até 6Kg)'
        },
        castrated: true,
        dateOfBirth: '2024-06-05T23:40:42.628Z',
        image: ''
      }])
    })

    it('ensure return an empty array if there are not pets registered', async () => {
      const response = await request(app)
        .get('/api/pet')
        .set('Authorization', accessToken)

      expect(response.status).toBe(200)
      expect(response.body).toEqual([])
    })
  })

  describe('PUT - /api/pet/:petId Route', () => {
    it('ensure update a pet', async () => {
      const pet = await request(app)
        .post('/api/pet')
        .set('Authorization', accessToken)
        .field('specieName', 'Cachorro')
        .field('petName', 'any pet name')
        .field('gender', 'M')
        .field('breedName', 'Afghan Hound')
        .field('size', 'Mini (Até 6Kg)')
        .field('dateOfBirth', '2024-06-05T23:40:42.628Z')
        .field('castrated', true)

      const response = await request(app)
        .put(`/api/pet/${pet.body.id as string}`)
        .set('Authorization', accessToken)
        .field({
          petName: 'pet name updated'
        })

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: expect.any(String),
        guardian: {
          id: expect.any(String),
          firstName: 'John',
          lastName: 'Doe',
          email: 'johndoe@email.com',
          phone: '11987654321',
          emailConfirmation: true
        },
        specie: {
          id: expect.any(String),
          name: 'Cachorro'
        },
        specieAlias: null,
        petName: 'pet name updated',
        gender: 'M',
        breedAlias: '',
        breed: {
          id: expect.any(String),
          name: 'Afghan Hound',
          specieId: expect.any(String)
        },
        size: {
          id: expect.any(String),
          name: 'Mini (Até 6Kg)',
          specieId: expect.any(String)
        },
        castrated: true,
        dateOfBirth: '2024-06-05T23:40:42.628Z',
        image: ''
      })
    })

    it('Should return 400 if no access token is provided', async () => {
      await request(app)
        .put('/api/pet/any_id')
        .set('Authorization', '')
        .expect(400)
    })

    it('Should return 406 (NotAcceptable) if invalid petId is Provided', async () => {
      await request(app)
        .put('/api/pet/invalid_pet_id')
        .set('Authorization', accessToken)
        .expect(406)
    })
  })

  describe('DELETE - /api/pet/:petId Route', () => {
    it('ensure delete a pet', async () => {
      const pet = await request(app)
        .post('/api/pet')
        .set('Authorization', accessToken)
        .field('specieName', 'Cachorro')
        .field('petName', 'any pet name')
        .field('gender', 'M')
        .field('breedName', 'Afghan Hound')
        .field('size', 'Mini (Até 6Kg)')
        .field('dateOfBirth', '2024-06-05T23:40:42.628Z')
        .field('castrated', true)

      const response = await request(app)
        .delete(`/api/pet/${pet.body.id as string}`)
        .set('Authorization', accessToken)

      expect(response.status).toBe(200)
      expect(response.body).toStrictEqual({
        message: 'Pet deleted',
        petId: pet.body.id
      })
    })

    it('Should return 400 if no access token is provided', async () => {
      await request(app)
        .delete('/api/pet/any_id')
        .set('Authorization', '')
        .expect(400)
    })

    it('Should return 406 (NotAcceptable) if invalid petId is Provided', async () => {
      await request(app)
        .delete('/api/pet/invalid_pet_id')
        .set('Authorization', accessToken)
        .expect(406)
    })
  })
})
