import ModuleRegisterService from '@services/ModuleRegister.service'
import Controller from './User.controller'
import Endpoints from './User.endpoints'
import AuthenticationService from '@services/Authentication.service'

const ModuleRoutes = new ModuleRegisterService(Endpoints, Controller)

ModuleRoutes.registerEndpoints()

const routes = ModuleRoutes.getRoutes()

routes.get('/auth/google', AuthenticationService.google({ scope: 'https://www.google.com/m8/feeds' }))
routes.get('/auth/google/callback', AuthenticationService.google({ failureRedirect: '/login' }), Controller.auth)

export default routes
