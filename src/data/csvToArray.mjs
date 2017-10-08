import fs from 'fs';

export function csvToArray(csv) {
	const lines = csv.split(/\r?\n/);
	const splittedLines = lines.map(e => e.split(/;;/));
	const header = splittedLines.shift();
	const idColumnIndex = header.findIndex(e => /id/.test(e));
	header[idColumnIndex] = 'id';
	if (splittedLines[splittedLines.length - 1].length === 1) {
		splittedLines.pop();
	}
	const columnTypes = new Map(header.map((e, i) => [e, splittedLines.every(line => /^-?[\d.,]*$/.test(line[i]))]));
	const final = splittedLines.map(l => {
		const newObj = {};
		l.forEach((c, i) => {
			if (c.length > 0) {
				const column = header[i];
				const columnType = columnTypes.get(column);
				if (columnType === true) {
					newObj[column] = Number.parseFloat(c.replace(/\,/, '.'));
				}
				else {
					let string = c.replace(/^"(.+)"$/, '$1').replace(/""/g, '"').replace(/\\n/g, '\n');
					if (/^".*\{.+\}.*"$/.test(string)) {
						string = string.match(/^"(.+)"$/)[1];
					}
					newObj[column] = string;
				}
			}
		});
		return newObj;
	});
	return final;
}
