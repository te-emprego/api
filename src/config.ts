import dotenv from 'dotenv'
dotenv.config()

export default {
  app: {
    port: process.env.PORT || 3333,
    database: {
      connectionString: process.env.DATABASE_CONNECTION_STRING
    }
  },
  passport: {
    google: {
      client: {
        id: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        secret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET
      }
    }
  },
  requests: {
    window: 2 * 60 * 1000,
    delay: 200,
    limit: 50
  }
}
