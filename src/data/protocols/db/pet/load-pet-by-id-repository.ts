export interface LoadPetByIdRepository {
  loadById: (petId: LoadPetByIdRepository.Params) => Promise<LoadPetByIdRepository.Result>
}

export namespace LoadPetByIdRepository {
  export type Params = string

  export type Result = {
    id: string
    guardianId: string
    specie: {
      id: string
      name: string
    }
    specieAlias: string | null
    petName: string
    gender: string
    breedAlias: string
    breed: {
      id: string
      name: string
    }
    size: {
      id: string
      name: string
    }
    castrated: boolean
    dateOfBirth: Date
    image: string
  } | null
}
