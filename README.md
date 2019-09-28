# rollup-plugin-svelte-hmr

Svelte HMR with [Nollup](https://github.com/PepsRyuu/nollup).

## Status

This is an experimental implementation of Svelte HMR.

It relies on knowledge of Svelte internals and some private API, so stability across versions is not guaranteed. For the times being though, I'm committed to keep it working with the last versions of Svelte. In the future, dev hooks implemented in Svelte itself could alleviate this.

The plugin will probably stay in version 0.x for some time still but, you can always pin the patch version if you want your install to keep working as it is (if you want to stay on a given version of Svelte for some times, for example).

Please report the bugs you encounter to help stabilize Svelte HMR.

Also, I'm particularly interested to know how does the Nollup + HMR combo work with different Rollup configs & plugins.

## Installation

~~~
npm install --save-dev nollup rollup-plugin-svelte-hmr
~~~

If you want to keep your `rollup.config.js` in ESM (using `import ... from ...`), you'll also need something like [esm](https://www.npmjs.com/package/esm) to make it work with Nollup.

~~~
npm install --save-dev esm
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

Local state (i.e. local `let` vars that are not exported) is not preserved. It should be possible soon, with a minor modification to Svelte's dev API.

Please, report any other bug you find.
