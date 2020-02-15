import * as React from "react"
import { fmap } from "../../../../Data/Functor"
import { intercalate, List, map } from "../../../../Data/List"
import { Maybe, maybeToNullable } from "../../../../Data/Maybe"
import { Record } from "../../../../Data/Record"
import { BlessingCombined, BlessingCombinedA_ } from "../../../Models/View/BlessingCombined"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { sortStrings } from "../../../Utilities/sortBy"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  staticData: StaticDataRecord
  blessings: Maybe<List<Record<BlessingCombined>>>
}

export const LiturgicalChantsSheetBlessings: React.FC<Props> = props => {
  const { blessings, staticData } = props

  return (
    <TextBox
      label={translate (staticData) ("sheets.chantssheet.blessings")}
      className="blessings activatable-list"
      >
      <div className="list">
        {pipe_ (
          blessings,
          fmap (pipe (
            map (BlessingCombinedA_.name),
            sortStrings (staticData),
            intercalate (", ")
          )),
          maybeToNullable
        )}
      </div>
    </TextBox>
  )
}
