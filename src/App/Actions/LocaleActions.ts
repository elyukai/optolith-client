import { fromMaybe, isNothing, Maybe } from "../../Data/Maybe"
import { SET_LOCALE } from "../Constants/ActionTypes"
import { getSystemLocale } from "../Utilities/IOUtils"
import { Locale } from "../Utilities/Raw/JSON/Config"

export interface SetLocaleAction {
  type: SET_LOCALE
  payload: {
    locale: string
    localeType: "default" | "set"
  }
}

export const setLocale =
  (locale: Maybe<Locale>): SetLocaleAction => ({
    type: SET_LOCALE,
    payload: {
      locale: fromMaybe (getSystemLocale ()) (locale),
      localeType: isNothing (locale) ? "default" : "set",
    },
  })
