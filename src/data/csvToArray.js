module.exports = function csvToArray(csv) {
	const isRN = /\r\n/.test(csv);
	const lines = isRN ? csv.split(/\r\n/) : csv.split(/\n/);
	const splittedLines = lines.map(e => e.split(/;;/));
	const header = splittedLines.shift();
	const idColumnIndex = header.findIndex(e => /id/.test(e));
	header[idColumnIndex] = 'id';
	if (splittedLines[splittedLines.length - 1].length === 1) {
		splittedLines.pop();
	}
	const columnTypes = new Map(header.map((e, i) => [e, splittedLines.every(l => /^-?[\d.,]*$/.test(l[i]))]));
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
					let string = c.replace(/""/g, '"').replace(/\\n/g, '\n\n');
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
