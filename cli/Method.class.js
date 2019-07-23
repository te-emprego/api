const path = require('path')
const fs = require('fs')
const lodash = require('lodash')
const hbs = require('handlebars')

class Method {
  path = path
  fs = fs
  lodash = lodash
  hbs = hbs

  constructor () {
    this.path = path
    this.fs = fs
    this.lodash = lodash
    this.hbs = hbs
  }

  getModulesDir () {
    return this.path.resolve(__dirname, '../src/modules')
  }

  getTemplate (template) {
    const templateDir = this.path.resolve(__dirname, './templates/')
    return this.fs.readFileSync(`${templateDir}/${template}`, 'utf-8')
  }
}

module.exports = Method
