import { get } from 'lodash'
import { Router, Request, Response } from 'express'
import { Controller, Endpoint } from '@interfaces'
class ModuleRegisterService {
  public endpoints: Endpoint[]
  public controller: Controller
  public routes: Router

  public constructor (endpoints: Endpoint[], controller: Controller) {
    this.endpoints = endpoints
    this.controller = controller
    this.routes = Router()
  }

  private registerDocumentedRoutes (): void {
    this.routes.get('/_docs', (req: Request, res: Response): void => {
      try {
        res
          .send(this.endpoints)
      } catch (err) {
        res
          .status(500)
          .send({ message: err.message })
      }
    })
  }

  private getParams (params: string[], req: Request): any[] {
    const parameters = []
    params.forEach((param): void => {
      parameters.push(get(req, param))
    })
    return parameters
  }

  private async route (req: Request, res: Response, controller: Controller): Promise<Response> {
    const params = this.getParams(controller.params, req)
    const { status, data } = await this.controller[controller.method](...params)
    try {
      return res.status(status).send(data)
    } catch (err) {
      return res
        .status(500)
        .send({ message: err.message })
    }
  }

  private async documentation (res: Response, endpoint: Endpoint): Promise<Response> {
    try {
      return res.send(endpoint)
    } catch (err) {
      return res.status(500).send({ message: err.message })
    }
  }

  private async decideToRoute (req: Request, res: Response, endpoint: Endpoint): Promise<Response> {
    try {
      const controller = endpoint['@controller']
      return req.query.docs
        ? this.documentation(res, endpoint)
        : this.route(req, res, controller)
    } catch (err) {
      return res.status(500).send(err)
    }
  }

  private registerSingleEndpoint = (endpoint: Endpoint): void => {
    const { route } = endpoint
    const method = endpoint.method.toLowerCase()
    this.routes[method](route, (req: Request, res: Response): Promise<Response> => this.decideToRoute(req, res, endpoint))
  }

  public registerEndpoints (): void {
    this.endpoints
      .forEach(this.registerSingleEndpoint)
    this.registerDocumentedRoutes()
  }

  public getRoutes (): Router {
    return this.routes
  }
}

export default ModuleRegisterService
