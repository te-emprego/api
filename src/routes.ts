import { Router } from 'express'
import UsersModule from './modules/Users'

const routes = Router()

routes.use('/users', UsersModule)

export default routes
