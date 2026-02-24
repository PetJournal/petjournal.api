export interface UpdateGuardianImageRepository {
  updateImage: (params: UpdateGuardianImageRepository.Params) => Promise<UpdateGuardianImageRepository.Result>
}

export namespace UpdateGuardianImageRepository {
  export type Params = {
    guardianId: string
    image?: string
  }

  export type Result = {
    id: string
    firstName: string
    lastName: string
    email: string
    phone: string
    image: string
  } | undefined
}
