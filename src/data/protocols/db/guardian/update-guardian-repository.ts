export interface UpdateGuardianRepository {
  update: (params: UpdateGuardianRepository.Params) => Promise<UpdateGuardianRepository.Result>
}

export namespace UpdateGuardianRepository {
  export type Params = {
    guardianId: string
    firstName?: string
    lastName?: string
    phone?: string
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
