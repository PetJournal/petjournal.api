import { type LoadBreedByNameRepository, type LoadSpecieByNameRepository } from '@/data/protocols'
import { type Breed } from '@/domain/models/breed'
import { type Size } from '@/domain/models/size'
import { type Specie } from '@/domain/models/specie'
import { type AppointPet } from '@/domain/use-cases'

export class DbAppointPet implements AppointPet {
  private readonly specieRepository: LoadSpecieByNameRepository
  private readonly breedRepository: LoadBreedByNameRepository
  private readonly sizeRepository: LoadSpecieByNameRepository

  constructor ({
    specieRepository,
    breedRepository,
    sizeRepository
  }: AppointPet.Dependencies) {
    this.specieRepository = specieRepository
    this.breedRepository = breedRepository
    this.sizeRepository = sizeRepository
  }

  async appoint (params: AppointPet.Params): Promise<AppointPet.Result> {
    const specieResult = await this.getSpecie(params.specieName)
    const breedResult = await this.getBreed(params.breedName, specieResult.specie.name)
    const sizeResult = await this.getSize(params.size)
    return {
      specie: specieResult.specie,
      specieAlias: specieResult.specieAlias,
      breed: breedResult.breed,
      breedAlias: breedResult.breedAlias as string,
      size: sizeResult.size
    }
  }

  private async getSpecie (specieName: string): Promise<SpecieResult> {
    const specie = await this.specieRepository.loadByName(specieName)
    if (!specie) {
      const otherSpecie = await this.specieRepository.loadByName('Outros')
      return {
        ...otherSpecie,
        specie: otherSpecie as Specie & { id: string },
        specieAlias: specieName
      }
    }
    if (specie.name === 'Outros') {
      return {
        specie,
        specieAlias: 'Outros'
      }
    }
    return {
      specie,
      specieAlias: undefined
    }
  }

  private async getBreed (breedName: string, specieName: string): Promise<BreedResult> {
    if (this.isCatOrDog(specieName)) {
      const breed = await this.breedRepository.loadByName(breedName)
      if (!breed) {
        const otherBreed = await this.breedRepository.loadByName(`Outra raça ${specieName}`)
        return {
          breed: otherBreed as Breed & { id: string },
          breedAlias: breedName
        }
      }
      if (breed.name === `Outra raça ${specieName}`) {
        return {
          breed,
          breedAlias: `Outra raça ${specieName}`
        }
      }
      return {
        breed,
        breedAlias: ''
      }
    }
    const otherBreed = await this.breedRepository.loadByName('Sem raça')
    return {
      breed: otherBreed as Breed & { id: string },
      breedAlias: ''
    }
  }

  private isCatOrDog (specieName: string): boolean {
    if (specieName === 'Cachorro' || specieName === 'Gato') {
      return true
    }
    return false
  }

  private async getSize (sizeName: string): Promise<SizeResult> {
    const size = await this.sizeRepository.loadByName(sizeName)
    if (!size) {
      const otherSize = await this.sizeRepository.loadByName('Sem porte')
      return {
        size: otherSize as Size & { id: string }
      }
    }
    return {
      size
    }
  }
}

type SpecieResult = {
  specie: Specie & { id: string }
  specieAlias: string | undefined
}

type BreedResult = {
  breed: Breed & { id: string }
  breedAlias: string | undefined
}

type SizeResult = {
  size: Size & { id: string }
}
