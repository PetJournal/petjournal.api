import type { NextFunction, Request, Response } from 'express'
import multer from 'multer'

const BYTE = 1
const KILOBYTE = 1024 * BYTE
const MEGABYTE = 1024 * KILOBYTE

const uploadMulter = multer({
  limits: {
    fileSize: 2 * MEGABYTE
  }
})

export const upload = (req: Request, res: Response, next: NextFunction): void => {
  const uploadSingle = uploadMulter.single('image')

  uploadSingle(req, res, (err: any) => {
    if (!err) {
      next()
    }

    if (err instanceof multer.MulterError) {
      return res.status(400).json({ error: err.message })
    }

    next(err)
  })
}
