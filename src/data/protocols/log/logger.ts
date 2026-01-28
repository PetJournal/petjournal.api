export interface Logger {
  info: (message: string, meta?: object) => void
  debug: (message: string, meta?: object) => void
  error: (message: string, error?: Error) => void
}
