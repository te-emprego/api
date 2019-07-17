class HttpException {
  public status: number
  public message: string
  public data: any

  public constructor (status: number, message: string, data?: any) {
    this.status = status
    this.message = message
    this.data = data || {}
  }
}
export default HttpException
