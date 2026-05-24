import { type Validation } from '@/application/protocols'
import { NotificationEmailValidation, NotificationMobileValidation, OptionalFieldValidation, ValidationComposite } from '@/application/validation'
import { BooleanValidatorAdapter } from '@/infra/validators'

export const makeSettingsUpdateValidation = (): ValidationComposite => {
  const validations: Validation[] = []

  validations.push(new OptionalFieldValidation('notificationEmail', new NotificationEmailValidation('notificationEmail', new BooleanValidatorAdapter())))
  validations.push(new OptionalFieldValidation('notificationMobile', new NotificationMobileValidation('notificationMobile', new BooleanValidatorAdapter())))

  return new ValidationComposite(validations)
}
