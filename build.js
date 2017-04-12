const packager = require('electron-packager');
const rcedit = require('rcedit');

packager({
	dir: '.',
	appCopyright: 'Dieses Produkt wurde unter Lizenz erstellt. Das Schwarze Auge und sein Logo sowie Aventuria, Dere, Myranor, Riesland, Tharun und Uthuria und ihre Logos sind eingetragene Marken von Significant GbR in Deutschland, den U.S.A. und anderen Ländern. Ulisses Spiele und sein Logo sind eingetragene Marken der Ulisses Medien und Spiele Distribution GmbH. Dieses Werk enthält Material, das durch Ulisses Spiele und/oder andere Autoren urheberrechtlich geschützt ist. Solches Material wird mit Erlaubnis im Rahmen der Vereinbarung über Gemeinschaftsinhalte für SCRIPTORIUM AVENTURIS verwendet. Alle anderen Originalmaterialien in diesem Werk sind Copyright (c) 2017-Gegenwart von Lukas Obermann und werden im Rahmen der Vereinbarung über Gemeinschaftsinhalte für SCRIPTORIUM AVENTURIS veröffentlicht.',
	arch: 'x64',
	asar: true,
	icon: './resources/icon',
	ignore: /(src|\/data$|data\/|\/css|\.vs|\.vscode|__tests__|node_modules|webpack\.config\.js|tslint\.json|tsconfig\.json|jsconfig\.json|\.gitattributes|\.gitignore|build\.js)/,
	name: 'tdeheroes',
	out: '../TDE app builds',
	overwrite: true,
	platform: ['win32', 'darwin'],
	win32metadata: {
		CompanyName: 'Lukas Obermann',
		FileDescription: 'DSA5 Heldentool',
		OriginalFilename: 'tdeheroes.exe',
		ProductName: 'DSA5 Heldentool',
		InternalName: 'TDE app'
	},
	appCategoryType: 'public.app-category.games'
}, (err, appPaths) => {
	if (err) {
		throw err;
	}
	console.log(`New package available under ${appPaths}`);
})
