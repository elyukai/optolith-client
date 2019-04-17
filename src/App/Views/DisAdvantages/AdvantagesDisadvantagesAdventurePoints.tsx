import * as React from "react";
import { List } from "../../../Data/List";
import { fromMaybe, Maybe } from "../../../Data/Maybe";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { translateP } from "../../Utilities/I18n";

export interface AdvantagesDisadvantagesAdventurePointsProps {
  total: number
  magical: number
  magicalMax: Maybe<number>
  blessed: number
  l10n: L10nRecord
}

export function AdvantagesDisadvantagesAdventurePoints (
  props: AdvantagesDisadvantagesAdventurePointsProps
) {
  const {
    total,
    magical,
    magicalMax,
    blessed,
    l10n,
  } = props

  return (
    <p>
      {translateP (l10n) ("apspentonadvantages") (List (total, 80))}<br/>
      {
        magical > 0
          ? translateP (l10n)
                       ("apspentonmagicadvantages")
                       (List (magical, fromMaybe (50) (magicalMax)))
          : null
      }
      {magical > 0 && blessed > 0 ? <br/> : null}
      {
        blessed > 0
          ? translateP (l10n) ("apspentonblessedadvantages") (List (blessed, 50))
          : null
      }
    </p>
  )
}
