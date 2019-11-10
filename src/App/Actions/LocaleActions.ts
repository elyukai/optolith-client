import { fromMaybe, isNothing, Maybe } from "../../Data/Maybe";
import { ActionTypes } from "../Constants/ActionTypes";
import { getSystemLocale } from "../Utilities/IOUtils";
import { Locale } from "../Utilities/Raw/JSON/Config";

export interface SetLocaleAction {
  type: ActionTypes.SET_LOCALE
  payload: {
    locale: Locale;
    localeType: "default" | "set";
  }
}

export const setLocale =
  (locale: Maybe<Locale>): SetLocaleAction => ({
    type: ActionTypes.SET_LOCALE,
    payload: {
      locale: fromMaybe (getSystemLocale ()) (locale),
      localeType: isNothing (locale) ? "default" : "set",
    },
  })
