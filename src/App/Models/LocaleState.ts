import { Maybe, Nothing } from "../../Data/Maybe"
import { fromDefault, makeLenses } from "../../Data/Record"
import { Locale } from "../Utilities/Raw/JSON/Config"
import { L10nRecord } from "./Wiki/L10n"

export interface LocaleState {
  "@@name": "LocaleState"
  id: Maybe<Locale>
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
