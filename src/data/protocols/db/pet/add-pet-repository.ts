export interface AddPetRepository {
  add: (guardian: AddPetRepository.Params) => Promise<AddPetRepository.Result>
}

export namespace AddPetRepository {
  export interface Params {
    guardianId: string
    specieId: string
  }

  export type Result = {
    id: string
    guardianId: string
    specieId: string
  } | undefined
}
