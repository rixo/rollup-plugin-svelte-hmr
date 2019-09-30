import { doApplyHmr } from 'svelte-hmr/runtime'

const declinedModules = (window.__ROLLUP_PLUGIN_SVELTE_HMR_DECLINED_MODULES =
  window.__ROLLUP_PLUGIN_SVELTE_HMR_DECLINED_MODULES || {})

export function applyHmr(args) {
  const { m, id, hotOptions } = args

  if (declinedModules[id]) {
    declinedModules[id] = false
    if (!hotOptions.noReload) {
      reload()
    }
  }

  const decline = () => {
    declinedModules[id] = true
  }

  const accept = () => {
    m.hot.accept(() => require(m.id))
  }

  return doApplyHmr({ ...args, accept, decline })
}
