import * as React from "react"
import { fmap } from "../../../../Data/Functor"
import { intercalate, List, map } from "../../../../Data/List"
import { Maybe, maybeToNullable } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { CantripCombined, CantripCombinedA_ } from "../../../Models/View/CantripCombined"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { sortStrings } from "../../../Utilities/sortBy"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  cantrips: Maybe<List<Record<CantripCombined>>>
  staticData: StaticDataRecord
}

export const SpellsSheetCantrips: React.FC<Props> = props => {
  const { cantrips, staticData } = props

  return (
    <TextBox
      label={translate (staticData) ("sheets.spellssheet.cantrips")}
      className="cantrips activatable-list"
      >
      <div className="list">
        {pipe_ (
          cantrips,
          fmap (pipe (
            map (CantripCombinedA_.name),
            sortStrings (staticData),
            intercalate (", ")
          )),
          maybeToNullable
        )}
      </div>
    </TextBox>
  )
}
