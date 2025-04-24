export interface EventsGenerator {
  generate: (params: EventsGenerator.Params) => Promise<EventsGenerator.Result>
}

export namespace EventsGenerator {
  export type Params = {
    schedulerId: string
    startAt: Date
    endAt: Date
    daysOfWeek: number[] | undefined
    daysOfMonth: number[] | undefined
    daily: boolean | undefined
  }

  export type Result = Array<{
    schedulerId: string
    start: string
    end: string
    date: Date
  }>
}
