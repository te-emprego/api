import { get } from 'lodash'
import { Router, Request, Response } from 'express'

interface Controller {
  method?: string,
  params?: string[]
}

interface Endpoint {
  route?: string,
  method?: string,
  description?: string,
  '@controller': Controller
}

class ModuleRegisterService {
  public endpoints: Endpoint[]
  public controller
  public routes: Router

  public constructor (endpoints: Endpoint[], controller) {
    this.endpoints = endpoints
    this.controller = controller
    this.routes = Router()
  }

  private getParams (params: string[], req: Request): any[] {
    const parameters = []
    params.forEach((param): void => {
      parameters.push(get(req, param))
    })
    return parameters
  }

  private async registerRoute (req: Request, res: Response, controller: Controller): Promise<Response> {
    const params = this.getParams(controller.params, req)
    const { status, data } = await this.controller[controller.method](...params)
    return res
      .status(status)
      .send(data)
  }

  private registerSingleEndpoint = (endpoint: Endpoint): void => {
    const { route } = endpoint
    const controller = endpoint['@controller']
    const method = endpoint.method.toLowerCase()
    this.routes[method](route, (req: Request, res: Response): Promise<Response> => this.registerRoute(req, res, controller))
  }

  public registerEndpoints (): void {
    this.endpoints
      .forEach(this.registerSingleEndpoint)
  }

  public getRoutes (): Router {
    return this.routes
  }
}

export default ModuleRegisterService

export interface ModuleResponse {
  status: number
  data: object
}
