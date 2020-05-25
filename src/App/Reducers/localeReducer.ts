import { cnst, ident } from "../../Data/Function"
import { set } from "../../Data/Lens"
import { bind, fromMaybe, isJust, Just, Nothing } from "../../Data/Maybe"
import { Record } from "../../Data/Record"
import { SetFallbackLocaleAction } from "../Actions/FallbackLocaleActions"
import { ReceiveInitialDataAction } from "../Actions/InitializationActions"
import { SetLocaleAction } from "../Actions/LocaleActions"
import * as ActionTypes from "../Constants/ActionTypes"
import { Config } from "../Models/Config"
import { LocaleState, LocaleStateL } from "../Models/LocaleState"
import { StaticData } from "../Models/Wiki/WikiModel"
import { pipe } from "../Utilities/pipe"

type Action = ReceiveInitialDataAction | SetLocaleAction | SetFallbackLocaleAction

export const localeReducer =
  (action: Action): ident<Record<LocaleState>> => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA: {
        const mset_locale = bind (action.payload.config) (Config.A.locale)
        const mset_fallbackLocale = bind (action.payload.config) (Config.A.fallbackLocale)

        const id = fromMaybe (action.payload.defaultLocale) (mset_locale)
        const fallbackId = fromMaybe (action.payload.defaultLocale) (mset_fallbackLocale)

        return cnst (LocaleState ({
          id: Just (id),
          type: isJust (mset_locale) ? "set" : "default",
          fallbackId: Just (fallbackId),
          fallbackType: isJust (mset_fallbackLocale) ? "set" : "default",
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

      case ActionTypes.SET_FALLBACK_LOCALE:
        return pipe (
          set (LocaleStateL.fallbackType)
              (action.payload.localeType),
          set (LocaleStateL.fallbackId)
              (action.payload.localeType === "set" ? Just (action.payload.locale) : Nothing)
        )

      default:
        return ident
    }
  }
