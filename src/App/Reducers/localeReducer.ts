import { cnst, ident } from "../../Data/Function";
import { set } from "../../Data/Lens";
import { bind, fromMaybe, isJust, Just, Maybe, Nothing } from "../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { fst } from "../../Data/Tuple";
import { ReceiveInitialDataAction } from "../Actions/IOActions";
import { SetLocaleAction } from "../Actions/LocaleActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { L10nRecord } from "../Models/Wiki/L10n";
import { pipe } from "../Utilities/pipe";

type Action = ReceiveInitialDataAction | SetLocaleAction

export interface LocaleState {
  "@@name": "LocaleState"
  id: Maybe<string>
  type: "default" | "set"
  messages: Maybe<L10nRecord>
}

export const LocaleState =
  fromDefault ("LocaleState")
              <LocaleState> ({
                id: Nothing,
                type: "default",
                messages: Nothing,
              })

export const LocaleStateL = makeLenses (LocaleState)

export const localeReducer =
  (action: Action): ident<Record<LocaleState>> => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA: {
        const mset_locale = bind (action.payload.config) (x => Maybe (x.locale))

        const id = fromMaybe (action.payload.defaultLocale) (mset_locale)

        return cnst (LocaleState ({
          id: Just (id),
          type: isJust (mset_locale) ? "set" : "default",
          messages: Just (fst (action.payload.tables)),
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
