import { CurrentDateValidation } from '@/application/validation/validators'
import { type Validation } from '@/application/protocols'

export const makeCurrentDateTasksValidation = (): Validation => {
  return new CurrentDateValidation('date')
}
