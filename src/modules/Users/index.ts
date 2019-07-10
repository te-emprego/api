import { Router } from 'express'
import Controller from './User.controller'

const routes = Router()

routes.get('/', Controller.index)
routes.post('/', Controller.create)

export default routes
