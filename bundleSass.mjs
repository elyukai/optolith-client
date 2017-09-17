import fs from 'fs';
import sass from 'node-sass';

sass.render({
	file: 'src/Main.scss',
	outputStyle: 'compressed'
}, (err, result) => {
	if (err) {
		throw err;
	}
	fs.writeFile('app/main.css', result.css, err => {
		if (err) {
			throw err;
		}
		console.log('SCSS successfully bundled!');
	});
});
