import ModuleRegisterService from '@services/ModuleRegister.service'
import Controller from './User.controller'
import endpoints from './endpoints.json'
import AuthenticationService from '@services/Authentication.service'

const ModuleRoutes = new ModuleRegisterService(endpoints, Controller)

ModuleRoutes.registerEndpoints()

const routes = ModuleRoutes.getRoutes()

routes.get('/auth/google', AuthenticationService.google({ scope: 'https://www.google.com/m8/feeds' }))
routes.get('/auth/google/callback', AuthenticationService.google({ failureRedirect: '/login' }), Controller.auth)

export default routes
