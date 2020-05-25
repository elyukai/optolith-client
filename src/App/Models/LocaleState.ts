import { Maybe, Nothing } from "../../Data/Maybe"
import { OrderedMap } from "../../Data/OrderedMap"
import { fromDefault, makeLenses, Record } from "../../Data/Record"
import { Locale } from "./Locale"
import { L10nRecord } from "./Wiki/L10n"

export interface LocaleState {
  "@@name": "LocaleState"
  id: Maybe<string>
  type: "default" | "set"
  fallbackId: Maybe<string>
  fallbackType: "default" | "set"
  messages: Maybe<L10nRecord>
  availableLangs: OrderedMap<string, Record<Locale>>
}

export const LocaleState =
  fromDefault ("LocaleState")
              <LocaleState> ({
                id: Nothing,
                type: "default",
                fallbackId: Nothing,
                fallbackType: "default",
                messages: Nothing,
                availableLangs: OrderedMap.empty,
              })

export const LocaleStateL = makeLenses (LocaleState)
