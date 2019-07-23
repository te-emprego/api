'use strict'
const helpers = require('./helpers')

// get arguments
const args = process.argv.slice(2)

if (args.includes('create-module')) {
  const ModuleCreator = require('./CreateModule.method')

  const name = helpers.getParamInArguments('-n', args)
  if (!name) {
    throw new Error('Missing -n (name) param')
  }

  return new ModuleCreator(name)
}
