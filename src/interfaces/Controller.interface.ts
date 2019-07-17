export default interface Controller {
  method?: string,
  params?: string[],
  [key: string]: any
}
