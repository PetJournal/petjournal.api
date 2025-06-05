export interface DateAddDay {
  addDay: (dateTime: DateAddDay.Param) => DateAddDay.Result
}

export namespace DateAddDay {
  export type Param = any
  export type Result = any
}
