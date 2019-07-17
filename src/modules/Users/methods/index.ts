import createMethod from './Create.method'
import loginMethod from './Login.method'
import listMethod from './List.method'
import updateInfoMethod from './UpdateInfo.method'

export const create = createMethod
export const login = loginMethod
export const list = listMethod
export const updateInfo = updateInfoMethod

export default {
  create,
  login,
  list,
  updateInfo
}
