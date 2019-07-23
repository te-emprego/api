import ModuleRegisterService from '@services/ModuleRegister.service'
import * as Controller from './User.controller'
import Endpoints from './User.endpoints'

const ModuleRoutes = new ModuleRegisterService(Endpoints, Controller)

ModuleRoutes.registerEndpoints()

export default ModuleRoutes.getRoutes()
