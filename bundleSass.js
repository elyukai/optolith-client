const { writeFile } = require('fs');
const sass = require('node-sass');

sass.render({
	file: 'src/Main.scss',
	outputStyle: 'compressed'
}, (err, result) => {
	if (err) {
		throw new Error('SCSS render error!');
	}
	writeFile('app/main.css', result.css, (err) => {
		if (err) {
			throw new Error('CSS writing error!');
		}
		console.log('SCSS successfully bundled!');
	})
});
