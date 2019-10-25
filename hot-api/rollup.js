import { makeApplyHmr } from 'svelte-hmr/runtime'

export const applyHmr = makeApplyHmr(args => ({
  ...args,
  hot: args.m.hot,
}))
