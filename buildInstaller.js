const installer = require('electron-installer-windows')

const options = {
	src: '../TDE app builds/tdeheroes-win32-x64/',
	dest: '../TDE app builds/installers/'
};

console.log('Creating package (this may take a while)');

installer(options, (err) => {
	if (err) {
		console.error(err, err.stack);
		process.exit(1);
	}

	console.log('Successfully created package at ' + options.dest);
})
