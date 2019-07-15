import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import routes from './routes'
import middlewares from '@middlewares'
import config from '@config'

class App {
  public express: express.Application

  public constructor () {
    this.express = express()
    this.middlewares()
    this.database()
    this.routes()
  }

  public boot (): express.Application {
    // console.clear()
    console.log(`App starting at http://localhost:${config.app.port}`)
    return this.express
  }

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(...middlewares)
  }

  private database (): void {
    mongoose.set('useNewUrlParser', true)
    mongoose.set('useCreateIndex', true)
    mongoose.set('auth', { authdb: 'admin' })
    mongoose
      .connect(config.app.database.connectionString)
      .then((): void => {
        console.log('connected to db')
      })
      .catch((error): void => {
        console.log('error during database connection')
        console.log(error.message)
      })
  }

  private routes (): void {
    this.express.use(routes)
  }
}

export default App
