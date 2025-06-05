import { type DateToJSDate, type DateGeneratorUtc, type DateAddDay } from '@/data/protocols/service'
import { type DateSetTime } from '@/data/protocols/service/date/date-set-time'
import { DateTime } from 'luxon'

export class LuxonAdapter implements DateGeneratorUtc, DateToJSDate, DateSetTime, DateAddDay {
  generate (date: DateGeneratorUtc.Param): DateGeneratorUtc.Result {
    return DateTime.fromISO(date.toString(), { zone: 'utc' })
  }

  toJSDate (dateTime: DateToJSDate.Param): DateToJSDate.Result {
    return dateTime.toJSDate()
  }

  setTime (params: DateSetTime.Params): DateSetTime.Result {
    let dateTime = params.dateTime
    dateTime = dateTime.set({ hour: params.time.hour, minute: params.time.minute, second: params.time.second })
    return this.toJSDate(dateTime)
  }

  addDay (dateTime: DateAddDay.Param): DateAddDay.Result {
    return dateTime.plus({ days: 1 })
  }
}
