import createMethod from './Create.method'
import loginMethod from './Login.method'
import listMethod from './List.method'
import updateInfoMethod from './UpdateInfo.method'
import findMethod from './Find.method'

export const create = createMethod
export const login = loginMethod
export const list = listMethod
export const updateInfo = updateInfoMethod
export const find = findMethod

export default {
  create,
  login,
  list,
  updateInfo,
  find
}
