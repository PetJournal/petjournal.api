import { type Guardian } from '@/tests/utils'

export interface AddPet {
  add: (petData: AddPet.Params) => Promise<AddPet.Result>
}

export namespace AddPet {
  export interface Params {
    guardianId: string
    specieId: string
  }

  export type Result = {
    id: string
    guardian: Guardian
    // specie: Specie
  } | undefined

  export interface Dependencies {
    guardianRepository: AddPet
  }
}
