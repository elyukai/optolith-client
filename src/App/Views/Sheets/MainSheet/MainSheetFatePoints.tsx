import * as React from "react";
import { Just, Nothing } from "../../../../Data/Maybe";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { LabelBox } from "../../Universal/LabelBox";
import { TextBox } from "../../Universal/TextBox";

interface Props {
  fatePointsModifier: number
  l10n: L10nRecord
}

export const MainSheetFatePoints: React.FC<Props> = props => {
  const { fatePointsModifier, l10n } = props

  return (
    <TextBox className="fate-points" label={translate (l10n) ("fatepoints")}>
      <LabelBox
        label={translate (l10n) ("value")}
        value={Just (3)}
        />
      <LabelBox
        label={translate (l10n) ("bonus")}
        value={Just (fatePointsModifier)}
        />
      <LabelBox
        label={translate (l10n) ("max")}
        value={Just (fatePointsModifier + 3)}
        />
      <LabelBox
        label={translate (l10n) ("current")}
        value={Nothing}
        />
    </TextBox>
  )
}
