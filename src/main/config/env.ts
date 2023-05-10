export default {
  port: process.env.PORT ?? 3333,
  salt: process.env.SALT ?? 12,
  secret: process.env.SECRET ?? ''
}
