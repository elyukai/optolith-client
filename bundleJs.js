const { rollup } = require('rollup');
const rollupTS = require('rollup-plugin-typescript2');

rollup({
	entry: 'src/MainRenderer.tsx',
	plugins: [
		rollupTS()
	],
	external: ['react', 'react-dom']
}).then((bundle) => {
  bundle.write({
    format: 'cjs',
    dest: 'resources/bundle.js'
  }).then(() => {
		console.log('TS successfully bundled!');
	}).catch((reason) => {
		throw new Error(`JS writing error: ${reason}`);
	});
}).catch((reason) => {
	throw new Error(`TS render error: ${reason}`);
});
