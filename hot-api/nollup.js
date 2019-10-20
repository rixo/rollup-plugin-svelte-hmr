import { makeApplyHmr } from 'svelte-hmr/runtime'

const declinedModules = (window.__ROLLUP_PLUGIN_SVELTE_HMR_DECLINED_MODULES =
  window.__ROLLUP_PLUGIN_SVELTE_HMR_DECLINED_MODULES || {})

export const applyHmr = makeApplyHmr(args => {
  const { m, id, hotOptions, reload } = args

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

  return { ...args, accept, decline }
})
