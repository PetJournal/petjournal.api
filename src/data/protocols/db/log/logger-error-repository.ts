export interface LoggerErrorRepository {
  logError: (stack: string) => Promise<void>
}
