import { type LoggerErrorRepository } from '@/data/protocols'
import { prisma as db } from './prisma'

export class LoggerPgRepository implements LoggerErrorRepository {
  async logError (stack: string): Promise<void> {
    await db.logError.create({
      data: {
        stack,
        date: new Date()
      }
    })
  }
}
