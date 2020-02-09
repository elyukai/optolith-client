import * as React from "react"
import { List } from "../../../Data/List"
import { Maybe } from "../../../Data/Maybe"
import { Record } from "../../../Data/Record"
import { BlessedTradition } from "../../Constants/Groups"
import { AttributeCombined } from "../../Models/View/AttributeCombined"
import { BlessingCombined } from "../../Models/View/BlessingCombined"
import { LiturgicalChantWithRequirements, LiturgicalChantWithRequirementsA_ } from "../../Models/View/LiturgicalChantWithRequirements"
import { L10nRecord } from "../../Models/Wiki/L10n"
import { translate } from "../../Utilities/I18n"
import { getAspectsStr, getLCAddText, LCBCA } from "../../Utilities/Increasable/liturgicalChantUtils"
import { ChantsSortOptions } from "../../Utilities/Raw/JSON/Config"
import { SkillListItem } from "../Skills/SkillListItem"
import { ListItem } from "../Universal/ListItem"
import { ListItemName } from "../Universal/ListItemName"

const LCWRA_ = LiturgicalChantWithRequirementsA_

export interface LiturgicalChantsListItemInactiveProps {
  l10n: L10nRecord
  addChantsDisabled: boolean
  attributes: List<Record<AttributeCombined>>
  currentInfoId: Maybe<string>
  entry: Record<LiturgicalChantWithRequirements> | Record<BlessingCombined>
  insertTopMargin: boolean
  mtradition_id: Maybe<BlessedTradition>
  sortOrder: ChantsSortOptions
  addToList: (id: string) => void
  addBlessingToList: (id: string) => void
  selectForInfo: (id: string) => void
}

type FC = React.FC<LiturgicalChantsListItemInactiveProps>

export const LiturgicalChantsListItemInactive: FC = props => {
  const {
    l10n,
    attributes,
    entry,
    currentInfoId,
    addChantsDisabled,
    mtradition_id,
    insertTopMargin,
    sortOrder,
    addToList,
    addBlessingToList,
    selectForInfo,
  } = props

  const aspects = getAspectsStr (l10n) (entry) (mtradition_id)

  if (LCBCA.active (entry)) {
    return (
      <ListItem
        key={LCBCA.id (entry)}
        disabled
        insertTopMargin={insertTopMargin}
        >
        <ListItemName name={LCBCA.name (entry)} />
      </ListItem>
    )
  }
  else if (BlessingCombined.is (entry)) {
    return (
      <SkillListItem
        key={LCBCA.id (entry)}
        id={LCBCA.id (entry)}
        name={LCBCA.name (entry)}
        isNotActive
        activate={addBlessingToList}
        addFillElement
        insertTopMargin={insertTopMargin}
        attributes={attributes}
        l10n={l10n}
        selectForInfo={selectForInfo}
        addText={
          sortOrder === "group"
            ? `${aspects} / ${translate (l10n) ("liturgicalchants.groups.blessing")}`
            : aspects
        }
        selectedForInfo={currentInfoId}
        />
    )
  }
  else {
    const add_text = getLCAddText (l10n) (sortOrder) (aspects) (entry)

    return (
      <SkillListItem
        key={LCBCA.id (entry)}
        id={LCBCA.id (entry)}
        name={LCBCA.name (entry)}
        isNotActive
        activate={addToList}
        activateDisabled={addChantsDisabled}
        addFillElement
        check={LCWRA_.check (entry)}
        checkmod={LCWRA_.checkmod (entry)}
        ic={LCWRA_.ic (entry)}
        insertTopMargin={insertTopMargin}
        attributes={attributes}
        l10n={l10n}
        selectForInfo={selectForInfo}
        addText={add_text}
        selectedForInfo={currentInfoId}
        />
    )
  }
}
