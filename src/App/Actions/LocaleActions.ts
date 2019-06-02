import { fromMaybe, isNothing, Maybe } from "../../Data/Maybe";
import { ActionTypes } from "../Constants/ActionTypes";
import { getSystemLocale } from "../Utilities/IOUtils";

export interface SetLocaleAction {
  type: ActionTypes.SET_LOCALE
  payload: {
    locale: string;
    localeType: "default" | "set";
  }
}

export const setLocale =
  (locale: Maybe<string>): SetLocaleAction => ({
    type: ActionTypes.SET_LOCALE,
    payload: {
      locale: fromMaybe (getSystemLocale ()) (locale),
      localeType: isNothing (locale) ? "default" : "set",
    },
  })
