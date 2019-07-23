/**
 * Retorna o próximo valor de um argumento
 * @param {string} param
 * @param {array} args
 */
const getParamInArguments = (param, args) => {
  const next = args.indexOf(param) + 1
  return next ? args[next] : undefined
}

module.exports = {
  getParamInArguments
}
