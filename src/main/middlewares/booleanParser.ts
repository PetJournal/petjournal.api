import { type NextFunction, type Request, type Response } from 'express'

export const booleanParser = (fieldName: string) => async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const booleansString = ['true', 'false']
  if (booleansString.includes(req.body[fieldName])) {
    req.body[fieldName] = req.body[fieldName] === 'true'
  }

  next()
}
