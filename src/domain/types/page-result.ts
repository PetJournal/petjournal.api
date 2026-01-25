import { type ResultResponse } from './result'

type PageInfo = {
  page: number
  limit: number
  totalPages: number
}

type PageData<T, K extends string> = PageInfo & { [key in K]: T[] }

export type PageResult<T, K extends string> = ResultResponse<PageData<T, K>>
