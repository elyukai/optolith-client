import { cnst, ident } from "../../Data/Function"
import { set } from "../../Data/Lens"
import { bind, fromMaybe, isJust, Just, Nothing } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { ReceiveInitialDataAction } from "../Actions/IOActions"
import { SetLocaleAction } from "../Actions/LocaleActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { Config } from "../Models/Config"
import { LocaleState, LocaleStateL } from "../Models/LocaleState"
import { StaticData } from "../Models/Wiki/WikiModel"
import { pipe } from "../Utilities/pipe"

type Action = ReceiveInitialDataAction | SetLocaleAction

export const localeReducer =
  (action: Action): ident<Record<LocaleState>> => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA: {
        const mset_locale = bind (action.payload.config) (Config.A.locale)

        const id = fromMaybe (action.payload.defaultLocale) (mset_locale)

        return cnst (LocaleState ({
          id: Just (id),
          type: isJust (mset_locale) ? "set" : "default",
          messages: Just (StaticData.A.ui (action.payload.staticData)),
          availableLangs: action.payload.availableLangs,
        }))
      }

      case ActionTypes.SET_LOCALE:
        return pipe (
          set (LocaleStateL.type)
              (action.payload.localeType),
          set (LocaleStateL.id)
              (action.payload.localeType === "set" ? Just (action.payload.locale) : Nothing)
        )

      default:
        return ident
    }
  }
