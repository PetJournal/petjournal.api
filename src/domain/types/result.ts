type Success<T> = {
  isSuccess: true
  data: T
}

type Failure = {
  isSuccess: false
  error: Error
}

export type ResultResponse<T> = Success<T> | Failure
