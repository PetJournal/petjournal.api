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

    let imageUrl: string = ''
    if (guardianData.image) {
      imageUrl = await this.fileStorage.save({ file: guardianData.image, fileName: `images/guardian-${guardian?.id as string}` })
    }

    if (imageUrl) {
      await this.guardianRepository.updateImage({ guardianId: guardian?.id as string, image: imageUrl })
    }

    return {
      id: guardian?.id as string,
      email: guardian?.email as string,
      firstName: guardian?.firstName as string,
      lastName: guardian?.lastName as string,
      phone: guardian?.phone as string,
      image: imageUrl ?? this.defaultGuardianImageUrl
    }
  }
}
