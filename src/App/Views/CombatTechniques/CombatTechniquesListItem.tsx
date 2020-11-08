import * as React from "react"
import { equals } from "../../../Data/Eq"
import { fmapF } from "../../../Data/Functor"
import { find, flength, intercalate, List } from "../../../Data/List"
import { fromMaybe, listToMaybe, mapMaybe, Maybe, maybe } from "../../../Data/Maybe"
import { lookupF } from "../../../Data/OrderedMap"
import { Record } from "../../../Data/Record"
import { NumIdName } from "../../Models/NumIdName"
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined"
import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../Models/View/CombatTechniqueWithRequirements"
import { StaticData, StaticDataRecord } from "../../Models/Wiki/WikiModel"
import { ndash } from "../../Utilities/Chars"
import { pipe, pipe_ } from "../../Utilities/pipe"
import { SkillListItem } from "../Skills/SkillListItem"

const ACA_ = AttributeCombinedA_
const CTWRA = CombatTechniqueWithRequirements.A
const CTWRA_ = CombatTechniqueWithRequirementsA_

export interface CombatTechniqueListItemProps {
  staticData: StaticDataRecord
  attributes: List<Record<AttributeCombined>>
  combatTechnique: Record<CombatTechniqueWithRequirements>
  currentInfoId: Maybe<string>
  isRemovingEnabled: boolean
  addPoint: (id: string) => void
  removePoint: (id: string) => void
  selectForInfo: (id: string) => void
}

export const CombatTechniqueListItem: React.FC<CombatTechniqueListItemProps> = props => {
  const {
    attributes,
    currentInfoId,
    isRemovingEnabled,
    staticData,
    combatTechnique: ct,
    selectForInfo,
    addPoint,
    removePoint,
  } = props

  const primary =
    pipe_ (
      CTWRA_.primary (ct),
      mapMaybe ((id: string) => fmapF (find (pipe (ACA_.id, equals (id)))
                                            (attributes))
                                      (ACA_.short)),
      intercalate ("/")
    )

  const customClassName =
    flength (CTWRA_.primary (ct)) > 1
      ? "ATTR_6_8"
      : fromMaybe ("") (listToMaybe (CTWRA_.primary (ct)))

  const primaryClassName = `primary ${customClassName}`

  return (
    <SkillListItem
      id={CTWRA_.id (ct)}
      name={CTWRA_.name (ct)}
      sr={CTWRA_.value (ct)}
      ic={CTWRA_.ic (ct)}
      checkDisabled
      addPoint={addPoint}
      addDisabled={!CTWRA.isIncreasable (ct)}
      removePoint={removePoint}
      removeDisabled={!isRemovingEnabled || !CTWRA.isDecreasable (ct)}
      addValues={List (
        { className: primaryClassName, value: primary },
        { className: "at", value: CTWRA.at (ct) },
        { className: "atpa" },
        {
          className: "pa",
          value: fromMaybe<string | number> (ndash) (CTWRA.pa (ct)),
        }
      )}
      attributes={attributes}
      staticData={staticData}
      isRemovingEnabled={isRemovingEnabled}
      selectForInfo={selectForInfo}
      group={CTWRA_.gr (ct)}
      getGroupName={
        pipe (
          lookupF (StaticData.A.combatTechniqueGroups (staticData)),
          maybe (ndash) (NumIdName.A.name)
        )
      }
      selectedForInfo={currentInfoId}
      />
  )
}
