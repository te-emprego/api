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

  private middlewares (): void {
    this.express.use(express.json())
    this.express.use(cors())
    this.express.use(...middlewares)
  }

  private database (): void {
    mongoose.set('useNewUrlParser', true)
    mongoose.connect(process.env.DATABASE_CONNECTION_STRING)
  }

  private routes (): void {
    this.express.use(routes)
  }

  public boot (): express.Application {
    // console.clear()
    console.log(`App starting at http://localhost:${config.app.port}`)
    return this.express
  }
}

export default App
