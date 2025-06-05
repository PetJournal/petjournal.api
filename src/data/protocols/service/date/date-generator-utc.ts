export interface DateGeneratorUtc {
  generate: (date: DateGeneratorUtc.Param) => DateGeneratorUtc.Result
}

export namespace DateGeneratorUtc {
  export type Param = Date
  export type Result = any
}
