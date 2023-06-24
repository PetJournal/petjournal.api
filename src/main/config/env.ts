import dotenv from 'dotenv'

dotenv.config()
export default {
  port: process.env.PORT ?? 3333,
  salt: process.env.SALT ?? 12,
  secret: process.env.SECRET ?? 'secret',
  mailService: process.env.MAIL_SERVICE ?? '',
  mailUser: process.env.MAIL_USER ?? '',
  mailPass: process.env.MAIL_PASS ?? ''
}
