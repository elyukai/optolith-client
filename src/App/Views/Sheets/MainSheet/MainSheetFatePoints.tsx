import * as React from "react";
import { Just, Nothing } from "../../../../Data/Maybe";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { translate } from "../../../Utilities/I18n";
import { LabelBox } from "../../Universal/LabelBox";
import { TextBox } from "../../Universal/TextBox";

export interface SkillsSheetLanguagesProps {
  fatePointsModifier: number
  l10n: L10nRecord
}

export function MainSheetFatePoints (props: SkillsSheetLanguagesProps) {
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
