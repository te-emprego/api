const Method = require('./Method.class')

class ModuleCreator extends Method {
  module
  templates

  constructor (name) {
    super()

    this.templates = {}
    this.module = {}

    this.module.name = this.lodash.upperFirst(this.lodash.camelCase(name))
    this.module.directory = this.path.resolve(this.getModulesDir(), this.module.name)

    this.prepareCreation()
  }

  prepareCreation = async () => {
    this
      .vefifyDirectory()
      .then(this.prepareTemplates)
      .then(this.storeModule)
  }

  vefifyDirectory = async () => {
    const exists = this.fs.existsSync(this.module.directory)
    if (exists) {
      throw new Error('Directory is not empty')
    }
  }

  prepareTemplates = async () => {
    const _controller = this.hbs.compile(this.getTemplate('Module.controller'))
    const _endpoints = this.hbs.compile(this.getTemplate('Module.endpoints'))
    const _index = this.hbs.compile(this.getTemplate('Module.index'))
    const _interface = this.hbs.compile(this.getTemplate('Module.interface'))
    const _schema = this.hbs.compile(this.getTemplate('Module.schema'))
    const _method = this.hbs.compile(this.getTemplate('Method.class'))

    const data = { module: this.module.name, moduleLower: this.lodash.camelCase(this.module.name) }

    this.templates = {
      controller: _controller(data),
      endpoints: _endpoints(data),
      index: _index(data),
      interface: _interface(data),
      schema: _schema(data),
      method: _method(data)
    }

    console.log(this.templates.index)
  }

  storeModule = async () => {
    this.fs.mkdirSync(this.module.directory)
    this.fs.mkdirSync(this.path.resolve(this.module.directory, './methods'))

    Object.keys(this.templates).forEach(key => {
      const toRender = this.templates[key]
      const name = key === 'method'
        ? 'methods/Hi.method.ts'
        : `${this.module.name}.${key}.ts`

      const path = this.path.resolve(this.module.directory, `./${name}`)
      this.fs.writeFileSync(path, toRender)
    })
  }
}

module.exports = ModuleCreator
