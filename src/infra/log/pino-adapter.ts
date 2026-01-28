import { type Logger } from '@/data/protocols/log/logger'
import pino from 'pino'

export class PinoAdapter implements Logger {
  private readonly logger: pino.Logger

  constructor (name: string) {
    this.logger = pino({
      level: process.env.LOG_LEVEL ?? 'info',
      base: { name },
      transport: process.env.NODE_ENV !== 'production'
        ? {
            target: 'pino-pretty',
            options: {
              colorize: true,
              translateTime: 'SYS:standard',
              ignore: 'pid,hostname'
            }
          }
        : undefined
    })
  }

  info (message: string, meta?: object): void {
    this.logger.info(meta, message)
  }

  debug (message: string, meta?: object): void {
    this.logger.debug(meta, message)
  }

  error (message: string, error?: Error): void {
    this.logger.error(error, message)
  }
}
