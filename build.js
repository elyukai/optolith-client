const packager = require('electron-packager');

const options = {
	dir: '.',
	appCopyright: 'Dieses Produkt wurde unter Lizenz erstellt. Das Schwarze Auge und sein Logo sowie Aventuria, Dere, Myranor, Riesland, Tharun und Uthuria und ihre Logos sind eingetragene Marken von Significant GbR in Deutschland, den U.S.A. und anderen Ländern. Ulisses Spiele und sein Logo sind eingetragene Marken der Ulisses Medien und Spiele Distribution GmbH. Dieses Werk enthält Material, das durch Ulisses Spiele und/oder andere Autoren urheberrechtlich geschützt ist. Solches Material wird mit Erlaubnis im Rahmen der Vereinbarung über Gemeinschaftsinhalte für SCRIPTORIUM AVENTURIS verwendet. Alle anderen Originalmaterialien in diesem Werk sind Copyright (c) 2017-Gegenwart von Lukas Obermann und werden im Rahmen der Vereinbarung über Gemeinschaftsinhalte für SCRIPTORIUM AVENTURIS veröffentlicht.',
	asar: true,
	icon: './app/icon',
	ignore: /(src|\/data$|data\/|\/css|\.rpt2_cache|wiki|\.vs|\.vscode|dist|__tests__|node_modules|webpack\.config\.js|tslint\.json|tsconfig\.json|jsconfig\.json|\.gitattributes|\.gitignore|build\.js)/,
	name: 'tdeheroes',
	out: './dist',
	overwrite: true,
	prune: true,
	win32metadata: {
		CompanyName: 'Lukas Obermann',
		FileDescription: 'DSA5 Heldentool',
		OriginalFilename: 'tdeheroes.exe',
		ProductName: 'DSA5 Heldentool',
		InternalName: 'TDE app'
	}
}

async function build() {
	try {
		const win32Paths = await packagerAsync({
			...options,
			arch: ['ia32', 'x64'],
			platform: 'win32'
		});
		const linuxPaths = await packagerAsync({
			...options,
			arch: 'x64',
			platform: 'linux'
		});
		const allPaths = [...win32Paths, ...linuxPaths];
		console.log(`New packages available under ${allPaths.join(', ')}`);
	}
	catch (error) {
		console.log(error);
	}
}

build();

function packagerAsync(options) {
	return new Promise((resolve, reject) => {
		packager(options, (err, paths) => {
			if (err) reject(err);
			resolve(paths);
		});
	})
}
