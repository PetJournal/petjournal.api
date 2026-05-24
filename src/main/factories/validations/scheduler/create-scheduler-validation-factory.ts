import { type Validation } from '@/application/protocols'
import { DailyValidation, DaysOfMonthValidation, DaysOfWeekValidation, DescriptionValidation, EndAtValidation, NoteValidation, OptionalFieldValidation, PetsIdValidation, RequiredFieldValidation, StartAtValidation, TitleValidation, UuidValidation, ValidationComposite } from '@/application/validation'
import { BooleanValidatorAdapter, DaysOfMonthValidatorAdapter, DaysOfWeekValidatorAdapter, DescriptionValidatorAdapter, EndAtValidatorAdapter, NoteValidatorAdapter, StartAtValidatorAdapter, TitleValidatorAdapter, UuidValidatorAdapter } from '@/infra/validators'

export const makeCreateSchedulerValidation = (): ValidationComposite => {
  const validations: Validation[] = []
  const requiredFields = ['tagId', 'title', 'description', 'note', 'startAt', 'endAt', 'pets']

  for (const field of requiredFields) {
    validations.push(new RequiredFieldValidation(field))
  }

  validations.push(new UuidValidation('tagId', new UuidValidatorAdapter()))
  validations.push(new TitleValidation('title', new TitleValidatorAdapter()))
  validations.push(new DescriptionValidation('description', new DescriptionValidatorAdapter()))
  validations.push(new NoteValidation('note', new NoteValidatorAdapter()))
  validations.push(new StartAtValidation('startAt', new StartAtValidatorAdapter()))
  validations.push(new EndAtValidation('endAt', 'startAt', new EndAtValidatorAdapter()))
  validations.push(new PetsIdValidation('pets', new UuidValidatorAdapter()))
  validations.push(new OptionalFieldValidation('daysOfWeek', new DaysOfWeekValidation('daysOfWeek', new DaysOfWeekValidatorAdapter())))
  validations.push(new OptionalFieldValidation('daysOfMonth', new DaysOfMonthValidation('daysOfMonth', new DaysOfMonthValidatorAdapter())))
  validations.push(new OptionalFieldValidation('daily', new DailyValidation('daily', new BooleanValidatorAdapter())))
  return new ValidationComposite(validations)
}
