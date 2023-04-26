export interface LoggerErrorRepository {
  log: (stack: string) => Promise<void>
}
