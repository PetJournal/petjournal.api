type Success<T> = {
  isSuccess: true
  data: T
  error?: never
}

type Failure = {
  isSuccess: false
  error: Error
  data?: never
}

export type ResultResponse<T> = Success<T> | Failure
