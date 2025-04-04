import { prisma as db } from './prisma'
import { type LoadTagByIdRepository, type AddTagRepository } from '@/data/protocols'

export class TagRepository implements AddTagRepository, LoadTagByIdRepository {
  async add (params: AddTagRepository.Params): Promise<AddTagRepository.Result> {
    try {
      const tag = await db.tag.create({
        data: {
          name: params.name,
          color: params.color
        },
        select: {
          id: true,
          name: true,
          color: true
        }
      })
      return tag
    } catch (error) {
      return undefined
    }
  }

  async loadById (tagId: LoadTagByIdRepository.Param): Promise<LoadTagByIdRepository.Result> {
    const tag = await db.tag.findFirst({
      where: {
        id: tagId
      },
      select: {
        id: true,
        name: true,
        color: true
      }
    })
    return tag
  }
}
