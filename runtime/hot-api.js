import { doApplyHMR } from 'svelte-hmr/runtime'

const declinedModules = (window.__ROLLUP_PLUGIN_SVELTE_HMR_DECLINED_MODULES =
  window.__ROLLUP_PLUGIN_SVELTE_HMR_DECLINED_MODULES || {})

const reload = () => {
  if (
    typeof window !== 'undefined' &&
    window.location &&
    window.location.reload
  ) {
    window.location.reload()
  }
}

export function applyHMR(
  targetModule,
  id,
  hotOptions,
  Component,
  ProxyAdapter,
  compileData
) {
  if (declinedModules[id]) {
    declinedModules[id] = false
    if (!hotOptions.noReload) {
      reload()
    }
  }

  try {
    const { proxy, error } = doApplyHMR(
      hotOptions,
      id,
      Component,
      ProxyAdapter,
      compileData
    )

    if (error && !hotOptions.optimistic) {
      declinedModules[id] = true
    } else {
      targetModule.hot.accept(() => require(targetModule.id))
    }

    return proxy
  } catch (err) {
    declinedModules[id] = true
    // since we won't return the proxy and the app will expect a svelte
    // component, it's gonna crash... so it's best to report the real cause
    throw err
    // throw new Error(`Failed to create HMR proxy for Svelte component ${id}`)
  }
}
