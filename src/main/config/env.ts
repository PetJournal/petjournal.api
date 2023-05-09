export default {
  port: process.env.port ?? 3333,
  secret: process.env.SECRET ?? '',
  mailUser: process.env.MAIL_USER ?? '',
  mailPass: process.env.MAIL_PASS ?? ''
}
