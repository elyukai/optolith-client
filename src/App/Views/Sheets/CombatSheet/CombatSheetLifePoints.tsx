import * as React from "react";
import { equals } from "../../../../Data/Eq";
import { find, List } from "../../../../Data/List";
import { bindF, Just, Maybe, Nothing } from "../../../../Data/Maybe";
import { Record } from "../../../../Data/Record";
import { DerivedCharacteristic } from "../../../Models/View/DerivedCharacteristic";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { DCIds } from "../../../Selectors/derivedCharacteristicsSelectors";
import { translate } from "../../../Utilities/I18n";
import { pipe, pipe_ } from "../../../Utilities/pipe";
import { Box } from "../../Universal/Box";
import { LabelBox } from "../../Universal/LabelBox";
import { TextBox } from "../../Universal/TextBox";

export interface CombatSheetLifePointsProps {
  derivedCharacteristics: List<Record<DerivedCharacteristic>>
  l10n: L10nRecord
}

export function CombatSheetLifePoints (props: CombatSheetLifePointsProps) {
  const { derivedCharacteristics, l10n } = props

  const lifePoints =
    pipe_ (
      derivedCharacteristics,
      find (pipe (DerivedCharacteristic.A.id, equals<DCIds> ("LP"))),
      bindF (DerivedCharacteristic.A.value),
      Maybe.sum
    )

  return (
    <TextBox
      className="life-points"
      label={translate (l10n) ("lifepoints")}
      >
      <div className="life-points-first">
        <LabelBox
          label={translate (l10n) ("max")}
          value={Just (lifePoints)}
          />
        <LabelBox
          label={translate (l10n) ("current")}
          value={Nothing}
          />
      </div>
      <div className="life-points-second">
        <Box />
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.75)}</Box>
        {translate (l10n) ("pain1")}
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.5)}</Box>
        {translate (l10n) ("pain2")}
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.25)}</Box>
        {translate (l10n) ("pain3")}
      </div>
      <div className="tiers">
        <Box>5</Box>
        {translate (l10n) ("pain4")}
      </div>
      <div className="tiers">
        <Box>0</Box>
        {translate (l10n) ("dying")}
      </div>
    </TextBox>
  )
}
