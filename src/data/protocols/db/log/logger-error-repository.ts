export interface LoggerErrorRepository {
  logError: (stack: LoggerErrorRepository.Params) => Promise<LoggerErrorRepository.Result>
}

export namespace LoggerErrorRepository {
  export type Params = string

  export type Result = void
}
