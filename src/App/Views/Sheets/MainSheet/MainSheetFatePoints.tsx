import * as React from "react"
import { Just, Nothing } from "../../../../Data/Maybe"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { LabelBox } from "../../Universal/LabelBox"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  fatePointsModifier: number
  staticData: StaticDataRecord
}

export const MainSheetFatePoints: React.FC<Props> = props => {
  const { fatePointsModifier, staticData } = props

  return (
    <TextBox className="fate-points" label={translate (staticData) ("sheets.mainsheet.fatepoints")}>
      <LabelBox
        label={translate (staticData) ("sheets.mainsheet.derivedcharacteristics.labels.value")}
        value={Just (3)}
        />
      <LabelBox
        label={translate (staticData) ("sheets.mainsheet.derivedcharacteristics.labels.bonus")}
        value={Just (fatePointsModifier)}
        />
      <LabelBox
        label={translate (staticData) ("sheets.mainsheet.derivedcharacteristics.labels.max")}
        value={Just (fatePointsModifier + 3)}
        />
      <LabelBox
        label={translate (staticData) ("sheets.mainsheet.derivedcharacteristics.labels.current")}
        value={Nothing}
        />
    </TextBox>
  )
}
