// @ts-check

import fs from 'fs';

/**
 * @typedef {string | number} CSVCell
 */

/**
 * @typedef {{ id: CSVCell; [key: CSVCell]: CSVCell; }} CSVEntry
 */

/**
 * @typedef {Map<CSVCell, CSVEntry>} CSVMap
 */

/**
 * Converts a CSV table into an array of entries.
 * @param csv {string} The CSV table.
 * @returns {CSVEntry[]}
 */
export function csvToArray(csv) {
  const lines = csv.split(/\r?\n/);
  const splittedLines = lines.map(e => e.split(/;;/));

  const validLines = splittedLines.filter(e => e.length > 1 || typeof e[0] === 'number' || typeof e[0] === 'string' && e[0].length > 0);

  const header = validLines.shift();

  const idColumnIndex = header.findIndex(e => /id/.test(e));
  header[idColumnIndex] = 'id';

  /**
   * @param element {string}
   * @param index {number}
   * @returns {[string, boolean]}
   */
  const isLineOfTypeNumber = (element, index) => {
    return [
      element,
      validLines.every(line => /^-?[\d.,]*$/.test(line[index]))
    ];
  };

  const columnsOfTypeNumber = new Map(header.map(isLineOfTypeNumber));

  /**
   * @type {CSVMap}
   */
  const finalMap = new Map();

  for (const line of validLines) {
    if (line.length > 1) {
      /**
       * @type {CSVEntry}
       */
      const newEntry = {
        id: line[header.findIndex(e => /id/.test(e))]
      };

      if (typeof newEntry.id === 'string' && /^-?[\d.,]*$/.test(newEntry.id)) {
        newEntry.id = Number.parseFloat(newEntry.id.replace(/\,/, '.'));
      }

      for (let i = 0; i < header.length; i++) {
        const cell = line[i];
        const column = header[i];

        if (cell.length > 0 && !/id/.test(column)) {
          const isColumnOfTypeNumber = columnsOfTypeNumber.get(column);

          if (isColumnOfTypeNumber) {
            newEntry[column] = Number.parseFloat(cell.replace(/\,/, '.'));
          }
          else {
            let string = cell.replace(/^"(.+)"$/, '$1')
            string = string.replace(/""/g, '"')
            string = string.replace(/\\n/g, '\n');
            if (/^".*\{.+\}.*"$/.test(string)) {
              string = string.match(/^"(.+)"$/)[1];
            }
            newEntry[column] = string;
          }
        }
      }

      finalMap.set(newEntry.id, newEntry);
    }
  }

  return [...finalMap.values()];
}
