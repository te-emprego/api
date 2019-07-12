import 'module-alias/register'
import config from './config'
import App from './app'

const app = new App()

app
  .boot()
  .listen(config.app.port)
