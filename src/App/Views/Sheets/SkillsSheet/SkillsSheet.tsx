import * as React from "react"
import { List } from "../../../../Data/List"
import { Maybe } from "../../../../Data/Maybe"
import { OrderedMap } from "../../../../Data/OrderedMap"
import { Record } from "../../../../Data/Record"
import { Pair } from "../../../../Data/Tuple"
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent"
import { AttributeCombined } from "../../../Models/View/AttributeCombined"
import { SkillCombined } from "../../../Models/View/SkillCombined"
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility"
import { StaticDataRecord } from "../../../Models/Wiki/WikiModel"
import { translate } from "../../../Utilities/I18n"
import { AttributeMods } from "../AttributeMods"
import { Sheet } from "../Sheet"
import { SheetWrapper } from "../SheetWrapper"
import { SkillsSheetLanguages } from "./SkillsSheetLanguages"
import { SkillsSheetQualityLevels } from "./SkillsSheetQualityLevels"
import { SkillsSheetRoutineChecks } from "./SkillsSheetRoutineChecks"
import { SkillsSheetScripts } from "./SkillsSheetScripts"
import { SkillsSheetSkills } from "./SkillsSheetSkills"

interface Props {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  languagesStateEntry: Maybe<Record<ActivatableDependent>>
  languagesWikiEntry: Maybe<Record<SpecialAbility>>
  staticData: StaticDataRecord
  scriptsStateEntry: Maybe<Record<ActivatableDependent>>
  scriptsWikiEntry: Maybe<Record<SpecialAbility>>
  skillsByGroup: Maybe<OrderedMap<number, List<Record<SkillCombined>>>>
  skillGroupPages: OrderedMap<number, Pair<number, number>>
  useParchment: boolean
  switchAttributeValueVisibility (): void
}

export const SkillsSheet: React.FC<Props> = props => {
  const {
    attributes,
    checkAttributeValueVisibility,
    languagesStateEntry,
    languagesWikiEntry,
    staticData,
    scriptsStateEntry,
    scriptsWikiEntry,
    skillsByGroup,
    skillGroupPages,
    useParchment,
  } = props

  return (
    <SheetWrapper>
      <Sheet
        id="skills-sheet"
        title={translate (staticData) ("sheets.gamestatssheet.title")}
        attributes={attributes}
        staticData={staticData}
        useParchment={useParchment}
        >
        <SkillsSheetSkills
          attributes={attributes}
          checkAttributeValueVisibility={checkAttributeValueVisibility}
          staticData={staticData}
          skillsByGroup={skillsByGroup}
          skillGroupPages={skillGroupPages}
          />
        <div className="lower">
          <div className="abilites">
            <SkillsSheetLanguages
              languagesStateEntry={languagesStateEntry}
              languagesWikiEntry={languagesWikiEntry}
              staticData={staticData}
              />
            <SkillsSheetScripts
              scriptsStateEntry={scriptsStateEntry}
              scriptsWikiEntry={scriptsWikiEntry}
              staticData={staticData}
              />
          </div>
          <AttributeMods
            attributes={attributes}
            staticData={staticData}
            />
          <SkillsSheetRoutineChecks staticData={staticData} />
          <SkillsSheetQualityLevels staticData={staticData} />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
