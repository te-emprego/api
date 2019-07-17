import createMethod from './methods/Create.method'
import loginMethod from './methods/Login.method'
import listMethod from './methods/List.method'
import updateInfoMethod from './methods/UpdateInfo.method'
import findMethod from './methods/Find.method'
import deactivateMethod from './methods/Deactivate.mehtod'

export const create = createMethod
export const login = loginMethod
export const list = listMethod
export const updateInfo = updateInfoMethod
export const find = findMethod
export const deactivate = deactivateMethod

export default {
  create: createMethod.run,
  login: loginMethod.handle,
  list: listMethod.handle,
  updateInfo: updateInfo.handle,
  find: find.handle,
  deactivate: deactivate.handle
}
