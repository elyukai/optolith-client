import * as React from "react"
import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { BlessedTradition } from "../../Constants/Groups"
import { ChantsSortOptions } from "../../Models/Config"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { BlessingCombined } from "../../Models/View/BlessingCombined"
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../Models/View/LiturgicalChantWithRequirements"
import { StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { translate } from "../../Utilities/I18n"
import { getAspectsStr, getLCAddText, LCBCA } from "../../Utilities/Increasable/liturgicalChantUtils"
import { SkillListItem } from "../Skills/SkillListItem"

const LCWRA = LiturgicalChantWithRequirements.A
const LCWRA_ = LiturgicalChantWithRequirementsA_

export interface LiturgicalChantsListItemActiveProps {
  staticData: StaticDataRecord
  attributes: List<Record<AttributeCombined>>
  currentInfoId: Maybe<string>
  entry: Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>
  insertTopMargin: boolean
  isRemovingEnabled: boolean
  mtradition_id: Maybe<BlessedTradition>
  sortOrder: ChantsSortOptions
  addPoint: (id: string) => void
  removePoint: (id: string) => void
  removeFromList: (id: string) => void
  removeBlessingFromList: (id: string) => void
  selectForInfo: (id: string) => void
}

type FC = React.FC<LiturgicalChantsListItemActiveProps>

export const LiturgicalChantsListItemActive: FC = props => {
  const {
    staticData,
    attributes,
    entry,
    currentInfoId,
    isRemovingEnabled,
    mtradition_id,
    insertTopMargin,
    sortOrder,
    addPoint,
    removePoint,
    removeFromList,
    removeBlessingFromList,
    selectForInfo,
  } = props

  const aspects = getAspectsStr (staticData) (entry) (mtradition_id)

  if (BlessingCombined.is (entry)) {
    return (
      <SkillListItem
        key={LCBCA.id (entry)}
        id={LCBCA.id (entry)}
        name={LCBCA.name (entry)}
        removePoint={removeBlessingFromList}
        removeDisabled={!isRemovingEnabled}
        addFillElement
        noIncrease
        insertTopMargin={insertTopMargin}
        attributes={attributes}
        staticData={staticData}
        isRemovingEnabled={isRemovingEnabled}
        selectForInfo={selectForInfo}
        addText={
          sortOrder === "group"
            ? `${aspects} / ${translate (staticData) ("liturgicalchants.groups.blessing")}`
            : aspects
        }
        selectedForInfo={currentInfoId}
        />
    )
  }
  else {
    const add_text = getLCAddText (staticData) (sortOrder) (aspects) (entry)

    return (
      <SkillListItem
        key={LCBCA.id (entry)}
        id={LCBCA.id (entry)}
        name={LCBCA.name (entry)}
        addDisabled={!LCWRA.isIncreasable (entry)}
        addPoint={addPoint}
        removeDisabled={!isRemovingEnabled || !LCWRA.isDecreasable (entry)}
        removePoint={LCWRA_.value (entry) === 0 ? removeFromList : removePoint}
        addFillElement
        check={LCWRA_.check (entry)}
        checkmod={LCWRA_.checkmod (entry)}
        ic={LCWRA_.ic (entry)}
        sr={LCWRA_.value (entry)}
        insertTopMargin={insertTopMargin}
        attributes={attributes}
        staticData={staticData}
        isRemovingEnabled={isRemovingEnabled}
        selectForInfo={selectForInfo}
        addText={add_text}
        selectedForInfo={currentInfoId}
        />
    )
  }
}
