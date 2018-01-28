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
export function csvToMap(csv) {
  const lines = csv.split(/\r?\n/);
  const splittedLines = lines.map(e => e.split(/;;/));

  const header = splittedLines.shift();

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
      splittedLines.every(line => /^-?[\d.,]*$/.test(line[index]))
    ];
  };

  const columnsOfTypeNumber = new Map(header.map(isLineOfTypeNumber));

  /**
   * @type {CSVMap}
   */
  const finalMap = new Map();

  for (const line of splittedLines) {
    if (line.length > 1) {
      /**
       * @type {CSVEntry}
       */
      const newEntry = {
        id: line[header.findIndex(e => /id/.test(e))]
      };

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
