const path = require('path')
const { createFilter } = require('rollup-pluginutils')
const { createMakeHot } = require('svelte-hmr')

const hotApi = path.resolve(`${__dirname}/runtime/hot-api.js`)

const posixify = file => file.replace(/[/\\]/g, '/')

const quote = JSON.stringify

const globalName = '__ROLLUP_PLUGIN_SVELTE_HMR'

const hotApiAlias = 'rollup-plugin-svelte-hmr/_/hot-api'

const aliases = {
  [hotApiAlias]: hotApi,
}

const makeHot = createMakeHot(hotApi)

const svelteHmr = ({ hot = true, hotOptions = {} } = {}) => {
  const filter = createFilter('**/*.svelte', [])

  const options = JSON.stringify(hotOptions)

  const compileData = 'undefined' // TODO

  function transform(code, id) {
    if (!hot) return
    if (!filter(id)) return

    this.addWatchFile(hotApi)

    const transformed = makeHot(id, code, hotOptions)

    return transformed
  }

  let fs
  const _setFs = _fs => {
    fs = _fs
  }

  const resolveId = (target, from) => {
    const alias = aliases[target]
    if (alias) {
      return alias
    }
    if (fs) {
      const name = path.join(path.dirname(from), target)
      const extensions = ['.js', '.svelte']
      for (const ext of extensions) {
        const filename = name + ext
        if (fs.existsSync(filename) && fs.lstatSync(filename).isFile()) {
          return filename
        }
      }
    }
  }

  function load(id) {
    if (!fs) return
    return new Promise((resolve, reject) => {
      fs.readFile(id, 'utf8', (err, contents) => {
        if (err) reject(err)
        else resolve(contents)
      })
    })
  }

  // We need to pass _after_ Nollup's HMR plugin, that registers itself last.
  const nollupBundleInit = () => `
    const init = () => {
      if (typeof window === 'undefined') return
      if (!window.__hot) return
      if (!window.__hot.addErrorHandler) return
      window.__hot.addErrorHandler(
        err => {
          const adapter = window.__SVELTE_HMR_ADAPTER
          if (adapter && adapter.renderCompileError) {
            adapter.renderCompileError(err)
          }
        }
      )
    }
    setTimeout(init)
  `

  const listeners = {
    generateBundle: [],
    renderError: [],
  }

  const addListener = type => listener => {
    listeners[type].push(listener)
  }

  const fire = type => (...args) => {
    listeners[type].forEach(listener => listener(...args))
  }

  // function generateBundle(options, bundle, isWrite) {}
  // function renderError(error) {}
  const generateBundle = fire('generateBundle')
  const renderError = fire('renderError')

  const _onBundleGenerated = addListener('generateBundle')

  const _onRenderError = addListener('renderError')

  return {
    name: 'svelte-hmr',
    nollupBundleInit,
    resolveId,
    load,
    generateBundle,
    renderError,
    transform,
    // used by test driver
    _setFs,
    _onBundleGenerated,
    _onRenderError,
  }
}

module.exports = svelteHmr
