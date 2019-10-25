import { makeApplyHmr } from 'svelte-hmr/runtime'

const declinedModules = (window.__ROLLUP_PLUGIN_SVELTE_HMR =
  window.__ROLLUP_PLUGIN_SVELTE_HMR || {})

export const applyHmr = makeApplyHmr(args => {
  const { m, id, hotOptions, reload } = args

  const globState = window.__ROLLUP_PLUGIN_SVELTE_HMR

  const hotState = (globState[id] = globState[id] || { declined: false })

  if (hotState.declined) {
    if (!hotOptions.noReload) {
      reload()
    }
  }

  const dispose = handler => {
    m.hot.dispose(() => {
      if (!hotState.data) {
        hotState.data = {}
      }
      handler(hotState.data)
    })
  }

  // TODO not used anymore... remove?
  const decline = () => {
    hotState.declined = true
  }

  const accept = handler => {
    m.hot.accept(() => {
      require(m.id)
      if (handler) {
        handler()
      }
    })
  }

  const getHotData = () => hotState && hotState.data

  const hot = {
    data: hotState.data,
    dispose,
    accept,
  }

  return { ...args, hot }
})
