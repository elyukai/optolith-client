import { imap, List } from "../../Data/List";
import { fromIndexName } from "../Models/NumIdName";
import { createMaybeSelector } from "../Utilities/createMaybeSelector";
import { translate } from "../Utilities/I18n";
import { pipe_ } from "../Utilities/pipe";
import { sortStrings } from "../Utilities/sortBy";
import { getLocaleAsProp } from "./stateSelectors";

export const getConditions = createMaybeSelector (
  getLocaleAsProp,
  l10n =>
    pipe_ (
      List (
        translate (l10n) ("animosity"),
        translate (l10n) ("encumbrance"),
        translate (l10n) ("intoxicated"),
        translate (l10n) ("stupor"),
        translate (l10n) ("rapture"),
        translate (l10n) ("fear"),
        translate (l10n) ("paralysis"),
        translate (l10n) ("pain"),
        translate (l10n) ("confusion")
      ),
      sortStrings (l10n),
      imap (fromIndexName)
    )
)

export const getStates = createMaybeSelector (
  getLocaleAsProp,
  l10n =>
    pipe_ (
      List (
        translate (l10n) ("immobilized"),
        translate (l10n) ("unconscious"),
        translate (l10n) ("blind"),
        translate (l10n) ("bloodlust"),
        translate (l10n) ("burning"),
        translate (l10n) ("cramped"),
        translate (l10n) ("bound"),
        translate (l10n) ("incapacitated"),
        translate (l10n) ("diseased"),
        translate (l10n) ("prone"),
        translate (l10n) ("misfortune"),
        translate (l10n) ("rage"),
        translate (l10n) ("mute"),
        translate (l10n) ("deaf"),
        translate (l10n) ("surprised"),
        translate (l10n) ("badsmell"),
        translate (l10n) ("invisible"),
        translate (l10n) ("poisoned"),
        translate (l10n) ("petrified")
      ),
      sortStrings (l10n),
      imap (fromIndexName)
    )
)
