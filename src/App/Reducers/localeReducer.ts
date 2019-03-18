import { ident } from "../../Data/Function";
import { set } from "../../Data/Lens";
import { Just, Maybe, Nothing } from "../../Data/Maybe";
import { fromDefault, makeLenses, Record } from "../../Data/Record";
import { ReceiveInitialDataAction } from "../Actions/IOActions";
import { SetLocaleAction } from "../Actions/LocaleActions";
import { ActionTypes } from "../Constants/ActionTypes";
import { L10nRecord } from "../Models/Wiki/L10n";
import { pipe } from "../Utilities/pipe";

type Action = ReceiveInitialDataAction | SetLocaleAction

export interface LocaleState {
  id: Maybe<string>
  type: "default" | "set"
  messages: Maybe<L10nRecord>
}

export const LocaleState =
  fromDefault<LocaleState> ({
    id: Nothing,
    type: "default",
    messages: Nothing,
  })

export const LocaleStateL = makeLenses (LocaleState)

export const localeReducer =
  (action: Action): ident<Record<LocaleState>> => {
    switch (action.type) {
      case ActionTypes.RECEIVE_INITIAL_DATA: {
        const id =
          action.payload.config
          && (action.payload.config.locale || action.payload.defaultLocale)

        return {
          type: action.payload.config && action.payload.config.locale ? "set" : "default",
          id,
          messages: typeof id === "string"
            ? OrderedMap.of (Object.entries (action.payload.locales[id].ui))
              .toKeyValueObjectWith (e => Array.isArray (e) ? List.fromArray (e) : e) as UIMessages
            : undefined
        }
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
