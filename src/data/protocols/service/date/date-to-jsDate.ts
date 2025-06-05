export interface DateToJSDate {
  toJSDate: (dateTime: DateToJSDate.Param) => DateToJSDate.Result
}

export namespace DateToJSDate {
  export type Param = any
  export type Result = Date
}
