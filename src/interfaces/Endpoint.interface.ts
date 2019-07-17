import Controller from '@interfaces/Controller.interface'

export default interface Endpoint {
  route?: string
  method?: string
  description?: string
  '@controller': Controller
}
