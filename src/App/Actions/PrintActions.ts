import { PrintToPDFOptions } from "electron"
import { handleE } from "../../Control/Exception"
import { Either, isLeft, isRight, Right } from "../../Data/Either"
import { flip } from "../../Data/Function"
import { appendStr } from "../../Data/List"
import { isJust, maybe } from "../../Data/Maybe"
import * as IO from "../../System/IO"
import { getCurrentHeroName, getWiki } from "../Selectors/stateSelectors"
import { translate } from "../Utilities/I18n"
import { showSaveDialog, windowPrintToPDF } from "../Utilities/IOUtils"
import { pipe } from "../Utilities/pipe"
import { ReduxAction } from "./Actions"
import { addAlert, addDefaultErrorAlert, AlertOptions } from "./AlertActions"

const getDefaultPDFName = pipe (
  getCurrentHeroName,
  maybe ("")
        (flip (appendStr) (".pdf"))
)

const pdfOptions: PrintToPDFOptions = {
  marginsType: 1,
  pageSize: { width: 210000, height: 297000 },
  printBackground: true,
}

export const requestPrintHeroToPDF = (): ReduxAction<Promise<void>> =>
  async (dispatch, getState) => {
    const staticData = getWiki (getState ())

    const data = await windowPrintToPDF (pdfOptions)

    const path = await showSaveDialog ({
                   title: translate (staticData) ("sheets.dialogs.pdfexportsavelocation.title"),
                   defaultPath: getDefaultPDFName (getState ()),
                   filters: [
                     { name: "PDF", extensions: [ "pdf" ] },
                   ],
                 })

    const res = await maybe (Promise.resolve<Either<Error, void>> (Right (undefined)))
                            (pipe (flip (IO.writeFile) (data), handleE))
                            (path)

    if (isRight (res) && isJust (path)) {
      await dispatch (addAlert (AlertOptions ({
                                 message: translate (staticData) ("sheets.dialogs.pdfsaved"),
                               })))
    }
    else if (isLeft (res)) {
      await dispatch (addDefaultErrorAlert (staticData)
                                           (translate (staticData)
                                                      ("sheets.dialogs.pdfsaveerror.title"))
                                           (res))
    }
  }
