import dotenv from 'dotenv'

dotenv.config()
export default {
  host: process.env.HOST_URL ?? 'http://localhost:3333',
  port: process.env.PORT ?? 3333,
  salt: process.env.SALT ?? 12,
  secret: process.env.SECRET ?? 'secret',
  expiryTimeSeconds: process.env.EXPIRY_TIME_SECONDS ?? 300,
  mailService: process.env.MAIL_SERVICE ?? '',
  mailUser: process.env.MAIL_USER ?? '',
  mailPass: process.env.MAIL_PASS ?? '',
  nodeEnv: process.env.NODE_ENV ?? 'development',
  firebase: {
    projectId: process.env.FIREBASE_PROJECT_ID ?? '',
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET ?? '',
    defaultImageUrl: process.env.FIREBASE_DEFAULT_IMAGE_URL ?? ''
  },
  mailerooApiKey: process.env.MAILEROO_API_KEY ?? '',
  mailerooApiSenderUrl: process.env.MAILEROO_API_URL ?? '',
  emailPetJournal: process.env.MAILEROO_MAIL_USER ?? ''
}
