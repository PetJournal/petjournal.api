import { type LoggerErrorRepository } from '@/data/protocols/logger-error-repository'
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
