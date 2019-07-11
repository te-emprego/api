import ModuleRegisterService from '@services/ModuleRegister.service'
import Controller from './User.controller'
import endpoints from './endpoints.json'

const ModuleRoutes = new ModuleRegisterService(endpoints, Controller)

ModuleRoutes.registerEndpoints()

export default ModuleRoutes.getRoutes()
