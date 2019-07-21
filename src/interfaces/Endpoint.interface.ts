import { Controller } from '@interfaces'

export default interface Endpoint {
  route?: string
  method?: string
  description?: string
  '@controller': Controller
  '@middlewares'?: any[]
}
