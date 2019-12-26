import * as React from "react";
import { equals } from "../../../Data/Eq";
import { fmapF } from "../../../Data/Functor";
import { find, flength, intercalate, List } from "../../../Data/List";
import { fromMaybe, listToMaybe, mapMaybe, Maybe } from "../../../Data/Maybe";
import { Record } from "../../../Data/Record";
import { AttributeCombined, AttributeCombinedA_ } from "../../Models/View/AttributeCombined";
import { CombatTechniqueWithRequirements, CombatTechniqueWithRequirementsA_ } from "../../Models/View/CombatTechniqueWithRequirements";
import { L10nRecord } from "../../Models/Wiki/L10n";
import { ndash } from "../../Utilities/Chars";
import { translate } from "../../Utilities/I18n";
import { pipe, pipe_ } from "../../Utilities/pipe";
import { SkillListItem } from "../Skills/SkillListItem";

const ACA_ = AttributeCombinedA_
const CTWRA = CombatTechniqueWithRequirements.A
const CTWRA_ = CombatTechniqueWithRequirementsA_

export interface CombatTechniqueListItemProps {
  l10n: L10nRecord
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
    l10n,
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
      addDisabled={CTWRA_.value (ct) >= CTWRA.max (ct)}
      removePoint={removePoint}
      removeDisabled={!isRemovingEnabled || CTWRA_.value (ct) <= CTWRA.min (ct)}
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
      l10n={l10n}
      selectForInfo={selectForInfo}
      groupIndex={CTWRA_.gr (ct)}
      groupList={translate (l10n) ("combattechniquegroups")}
      selectedForInfo={currentInfoId}
      />
  )
}
