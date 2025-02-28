import multer from 'multer'

const uploadMulter = multer()

export const upload = uploadMulter.single('image')
