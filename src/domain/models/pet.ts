export enum PetGender {
  MALE = 'M',
  FEMALE = 'F'
}

export type Pet = {
  petName: string
  gender: PetGender
}
