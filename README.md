# rollup-plugin-svelte-hmr

Svelte HMR with [Nollup](https://github.com/PepsRyuu/nollup).

## Status

This is an experimental implementation of Svelte HMR. I hope this will be useful when official HMR is added to Svelte, but no such plans have been made yet.

This implementation works by abusing Svelte's private API, so stability across versions is all but guaranteed -- although I'm committed to keep it working for the times being.

Also it suffers some limitations that I don't know how to bypass until HMR hooks are implemented in Svelte itself. Most notably, indexed each blocks `{#each item as item, index}` will be messed by HMR updates.

There are probably other flaws. Please report the bugs you encounter so that I can try to fix them for now but, more importantly, document them and build test cases for when official implementation comes.

## Installation

~~~
npm install --save-dev nollup rollup-plugin-svelte-hmr
~~~

## Usage

Add it after the Svelte plugin to your `rollup.config.js`:

~~~js
// ...
const svelteHmr = require('rollup-plugin-svelte-hmr')

const development = process.env.NODE_ENV !== ''

module.exports = {
  // ...
  plugins: [
    svelte({
      // ...
    }),
    svelteHmr({
      hot: development,
    }),
    // ...
  ],
  // ...
}
~~~

When the `hot` option is set to `false`, the plugin will do nothing. This is useful for production builds. That's the only option for now.

You'll probably also need further adaptations to make your project compatible with Nollup. See the example in this repository for reference. See [this commit](https://github.com/rixo/rollup-plugin-svelte-hmr/commit/8f996342a1553ca787698c99a4737bc118f8ddf6) in particular, that makes all the changes needed to add HMR to the official Svelte template.

Then run it:

~~~
npx nollup -c --verbose
~~~

An go edit files!

## Known limitations

Indexed each blocks are not supported by HMR. If the items are reordered, then a HRM update of the involved components will mess the order of everything.

~~~
<!-- NOT SUPPORTED -->
{#each items item, index}
  ...
{/each}

<!-- should work -->
{#each items item}
  ...
{/each}
~~~
