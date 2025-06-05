export interface DateSetTime {
  setTime: (params: DateSetTime.Params) => DateSetTime.Result
}

export namespace DateSetTime {
  export type Params = {
    dateTime: any
    time: {
      hour: number
      minute: number
      second: number
    }
  }

  export type Result = any
}
