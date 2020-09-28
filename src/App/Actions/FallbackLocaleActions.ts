import { fromMaybe, isNothing, Maybe } from "../../Data/Maybe"
import { SET_FALLBACK_LOCALE } from "../Constants/ActionTypes"
import { Locale } from "../Models/Config"
import { getSystemLocale } from "../Utilities/IOUtils"

export interface SetFallbackLocaleAction {
  type: SET_FALLBACK_LOCALE
  payload: {
    locale: string
    localeType: "default" | "set"
  }
}

export const setFallbackLocale =
  (locale: Maybe<Locale>): SetFallbackLocaleAction => ({
    type: SET_FALLBACK_LOCALE,
    payload: {
      locale: fromMaybe (getSystemLocale ()) (locale),
      localeType: isNothing (locale) ? "default" : "set",
    },
  })
