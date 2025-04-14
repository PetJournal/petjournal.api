import { type AddTagRepository } from '@/data/protocols/db/tag/add-tag-repository'
import { prisma as db } from './prisma'

export class TagRepository implements AddTagRepository {
  async add (params: AddTagRepository.Params): Promise<AddTagRepository.Result> {
    try {
      const tag = await db.tag.create({
        data: {
          name: params.name,
          color: params.color
        }
      })
      return tag
    } catch (error) {
      return undefined
    }
  }
}
