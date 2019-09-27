import svelte from 'rollup-plugin-svelte'
import svelteHmr from 'rollup-plugin-svelte-hmr'
import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import livereload from 'rollup-plugin-livereload'
import { terser } from 'rollup-plugin-terser'
import staticFiles from 'rollup-plugin-static-files'

const production = process.env.NODE_ENV === 'production'

const hot = !production

export default {
  input: 'src/main.js',
  output: {
    sourcemap: true,
    format: 'iife',
    name: 'app',
    dir: 'dist',
    entryFileNames: '[name].[hash].js',
    assetFileNames: '[name].[hash][extname]',
  },
  plugins: [
    // NOTE needs to be before svelte(...) because we intend to overwrite
    // public/bundle.css stub -- my guess is there is a better way to handle
    // css, any suggestion welcome
    production &&
      staticFiles({
        include: ['./public'],
      }),

    svelte({
      // enable run-time checks when not in production
      dev: !production,
      // we'll extract any component CSS out into
      // a separate file — better for performance
			//
			// NOTE emit CSS is not supported with Nollup / HMR
			//
      ...(!hot && {
        css: css => css.write('dist/bundle.css'),
      })
    }),

		// NOTE set hot option to false for prod builds
		svelteHmr({ hot }),

    // If you have external dependencies installed from
    // npm, you'll most likely need these plugins. In
    // some cases you'll need additional configuration —
    // consult the documentation for details:
    // https://github.com/rollup/rollup-plugin-commonjs
    resolve({
      browser: true,
      dedupe: importee =>
        importee === 'svelte' || importee.startsWith('svelte/'),
    }),
    commonjs(),

    // Watch the `public` directory and refresh the
    // browser on changes when not in production
    //
    // NOTE disable livereload if you use Nollup!
    //
    // !production && !hot && livereload('public'),

    // If we're building for production (npm run build
    // instead of npm run dev), minify
    production && terser(),
  ],
  watch: {
    clearScreen: false,
  },
}
