import createMethod from './Create.method'
import loginMethod from './Login.method'
import listMethod from './List.method'
import updateInfoMethod from './UpdateInfo.method'
import findMethod from './Find.method'
import deactivateMethod from './Deactivate.mehtod'

export const create = createMethod
export const login = loginMethod
export const list = listMethod
export const updateInfo = updateInfoMethod
export const find = findMethod
export const deactivate = deactivateMethod

export default {
  create,
  login,
  list,
  updateInfo,
  find,
  deactivate
}
