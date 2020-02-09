import * as React from "react"
import { fmap } from "../../../../Data/Functor"
import { intercalate, List, map } from "../../../../Data/List"
import { Maybe, maybeToNullable } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { CantripCombined, CantripCombinedA_ } from "../../../Models/View/CantripCombined"
import { L10nRecord } from "../../../Models/Wiki/L10n"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { sortStrings } from "../../../Utilities/sortBy"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  cantrips: Maybe<List<Record<CantripCombined>>>
  l10n: L10nRecord
}

export const SpellsSheetCantrips: React.FC<Props> = props => {
  const { cantrips, l10n } = props

  return (
    <TextBox
      label={translate (l10n) ("sheets.spellssheet.cantrips")}
      className="cantrips activatable-list"
      >
      <div className="list">
        {pipe_ (
          cantrips,
          fmap (pipe (
            map (CantripCombinedA_.name),
            sortStrings (l10n),
            intercalate (", ")
          )),
          maybeToNullable
        )}
      </div>
    </TextBox>
  )
}
