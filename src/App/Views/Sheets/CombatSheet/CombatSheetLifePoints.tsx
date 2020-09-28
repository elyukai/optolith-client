import * as React from "react"
import { DerivedCharacteristicId } from "../../../../../app/Database/Schema/DerivedCharacteristics/DerivedCharacteristics.l10n"
import { equals } from "../../../../Data/Eq"
import { find, List } from "../../../../Data/List"
import { bindF, Just, Maybe, Nothing } from "../../../../Data/Maybe"
import { snd } from "../../../../Data/Tuple"
import { DCId } from "../../../Constants/Ids"
import { DerivedCharacteristicValues } from "../../../Models/View/DerivedCharacteristicCombined"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { DCPair } from "../../../Selectors/derivedCharacteristicsSelectors"
import { translate } from "../../../Utilities/I18n"
import { pipe, pipe_ } from "../../../Utilities/pipe"
import { Box } from "../../Universal/Box"
import { LabelBox } from "../../Universal/LabelBox"
import { TextBox } from "../../Universal/TextBox"

interface Props {
  derivedCharacteristics: List<DCPair>
  staticData: StaticDataRecord
}

export const CombatSheetLifePoints: React.FC<Props> = props => {
  const { derivedCharacteristics, staticData } = props

  const lifePoints =
    pipe_ (
      derivedCharacteristics,
      find (pipe (
        snd,
        DerivedCharacteristicValues.A.id,
        equals<DerivedCharacteristicId> (DCId.LP)
      )),
      bindF (pipe (snd, DerivedCharacteristicValues.A.value)),
      Maybe.sum
    )

  return (
    <TextBox
      className="life-points"
      label={translate (staticData) ("sheets.combatsheet.lifepoints.title")}
      >
      <div className="life-points-first">
        <LabelBox
          label={translate (staticData) ("sheets.combatsheet.lifepoints.max")}
          value={Just (lifePoints)}
          />
        <LabelBox
          label={translate (staticData) ("sheets.combatsheet.lifepoints.current")}
          value={Nothing}
          />
      </div>
      <div className="life-points-second">
        <Box />
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.75)}</Box>
        {translate (staticData) ("sheets.combatsheet.lifepoints.pain1")}
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.5)}</Box>
        {translate (staticData) ("sheets.combatsheet.lifepoints.pain2")}
      </div>
      <div className="tiers">
        <Box>{Math.round (lifePoints * 0.25)}</Box>
        {translate (staticData) ("sheets.combatsheet.lifepoints.pain3")}
      </div>
      <div className="tiers">
        <Box>{5}</Box>
        {translate (staticData) ("sheets.combatsheet.lifepoints.pain4")}
      </div>
      <div className="tiers">
        <Box>{0}</Box>
        {translate (staticData) ("sheets.combatsheet.lifepoints.dying")}
      </div>
    </TextBox>
  )
}
