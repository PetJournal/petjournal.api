import { adaptMiddleware } from '../adapters'
import { makeAccountConfirmationMiddlware } from '../factories'

export const accountConfirmation = adaptMiddleware(makeAccountConfirmationMiddlware())
