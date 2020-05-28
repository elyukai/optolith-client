import { Maybe } from "../../Data/Maybe"
import { StrMap } from "../../Data/StrMap"
import { Locale } from "./Locale"
import { L10n } from "./Wiki/L10n"

export interface LocaleState {
  "@@name": "LocaleState"
  id: Maybe<string>
  type: "default" | "set"
  fallbackId: Maybe<string>
  fallbackType: "default" | "set"
  messages: Maybe<L10n>
  availableLangs: StrMap<Locale>
}
