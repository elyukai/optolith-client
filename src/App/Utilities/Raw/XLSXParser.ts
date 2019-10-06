import * as xlsx from "xlsx";
import { OrderedMap } from "../../../Data/OrderedMap";
import { OrderedSet } from "../../../Data/OrderedSet";
import { CsvColumnDelimiter } from "./csvToList";

const workbookToMap =
  (wb: xlsx.WorkBook) =>
    OrderedMap.fromSet ((name: string) =>
                         xlsx.utils.sheet_to_csv (
                           wb .Sheets [name],
                           { FS: CsvColumnDelimiter, RS: "\n", blankrows: false }
                         ))
                       (OrderedSet.fromArray (wb.SheetNames))

export const readXLSX =
  async (pathToFile: string) => {
    try {
      const work_book = workbookToMap (xlsx.readFile (pathToFile))

      return Promise.resolve (work_book)
    }
    catch (e) {
      console.error (e)

      return Promise.reject (
        new Error (`readXLSX: XLSX file not found at ${pathToFile}.`)
      )
    }
  }
