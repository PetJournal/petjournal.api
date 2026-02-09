import { type AddGuardian } from '@/domain/use-cases'
import { type FileStorage, type AddGuardianRepository, type HashGenerator, type UpdateGuardianImageRepository } from '@/data/protocols'

export class DbAddGuardian implements AddGuardian {
  private readonly guardianRepository: AddGuardianRepository & UpdateGuardianImageRepository
  private readonly hashService: HashGenerator
  private readonly fileStorage: FileStorage
  private readonly defaultGuardianImageUrl: string

  constructor ({ guardianRepository, hashService, fileStorage, defaultGuardianImageUrl }: AddGuardian.Dependencies) {
    this.guardianRepository = guardianRepository
    this.hashService = hashService
    this.fileStorage = fileStorage
    this.defaultGuardianImageUrl = defaultGuardianImageUrl
  }

  async add (guardianData: AddGuardian.Params): Promise<AddGuardian.Result> {
    const hashedPassword = await this.hashService.encrypt({ value: guardianData.password })
    const guardian = await this.guardianRepository.add(Object.assign({}, { ...guardianData, image: '' }, { password: hashedPassword }))

    if (!guardian) {
      return undefined
    }

    let imageUrl: string = ''
    if (guardianData.image) {
      imageUrl = await this.fileStorage.save({ file: guardianData.image, fileName: `images/guardian-${guardian?.id}` })
    }

    if (imageUrl) {
      await this.guardianRepository.updateImage({ guardianId: guardian?.id, image: imageUrl })
    }

    return {
      id: guardian?.id,
      email: guardian?.email,
      firstName: guardian?.firstName,
      lastName: guardian?.lastName,
      phone: guardian?.phone,
      image: imageUrl ?? this.defaultGuardianImageUrl
    }
  }
}
