import * as React from "react";
import { List } from "../../../../Data/List";
import { Maybe } from "../../../../Data/Maybe";
import { OrderedMap } from "../../../../Data/OrderedMap";
import { Pair } from "../../../../Data/Pair";
import { Record } from "../../../../Data/Record";
import { ActivatableDependent } from "../../../Models/ActiveEntries/ActivatableDependent";
import { AttributeCombined } from "../../../Models/View/AttributeCombined";
import { SkillCombined } from "../../../Models/View/SkillCombined";
import { L10nRecord } from "../../../Models/Wiki/L10n";
import { SpecialAbility } from "../../../Models/Wiki/SpecialAbility";
import { translate } from "../../../Utilities/I18n";
import { Checkbox } from "../../Universal/Checkbox";
import { Options } from "../../Universal/Options";
import { AttributeMods } from "../AttributeMods";
import { Sheet } from "../Sheet";
import { SheetWrapper } from "../SheetWrapper";
import { SkillsSheetLanguages } from "./SkillsSheetLanguages";
import { SkillsSheetQualityLevels } from "./SkillsSheetQualityLevels";
import { SkillsSheetRoutineChecks } from "./SkillsSheetRoutineChecks";
import { SkillsSheetScripts } from "./SkillsSheetScripts";
import { SkillsSheetSkills } from "./SkillsSheetSkills";

export interface SkillsSheetProps {
  attributes: List<Record<AttributeCombined>>
  checkAttributeValueVisibility: boolean
  languagesStateEntry: Maybe<Record<ActivatableDependent>>
  languagesWikiEntry: Maybe<Record<SpecialAbility>>
  l10n: L10nRecord
  scriptsStateEntry: Maybe<Record<ActivatableDependent>>
  scriptsWikiEntry: Maybe<Record<SpecialAbility>>
  skillsByGroup: Maybe<OrderedMap<number, List<Record<SkillCombined>>>>
  skillGroupPages: OrderedMap<number, Pair<number, number>>
  switchAttributeValueVisibility (): void
}

export function SkillsSheet (props: SkillsSheetProps) {
  const {
    attributes,
    checkAttributeValueVisibility,
    languagesStateEntry,
    languagesWikiEntry,
    l10n,
    scriptsStateEntry,
    scriptsWikiEntry,
    skillsByGroup,
    skillGroupPages,
    switchAttributeValueVisibility,
  } = props

  return (
    <SheetWrapper>
      <Options>
        <Checkbox
          checked={checkAttributeValueVisibility}
          onClick={switchAttributeValueVisibility}
          >
          {translate (l10n) ("showattributevalues")}
        </Checkbox>
      </Options>
      <Sheet
        id="skills-sheet"
        title={translate (l10n) ("gamestats")}
        attributes={attributes}
        l10n={l10n}
        >
        <SkillsSheetSkills
          attributes={attributes}
          checkAttributeValueVisibility={checkAttributeValueVisibility}
          l10n={l10n}
          skillsByGroup={skillsByGroup}
          skillGroupPages={skillGroupPages}
          />
        <div className="lower">
          <div className="abilites">
            <SkillsSheetLanguages
              languagesStateEntry={languagesStateEntry}
              languagesWikiEntry={languagesWikiEntry}
              l10n={l10n}
              />
            <SkillsSheetScripts
              scriptsStateEntry={scriptsStateEntry}
              scriptsWikiEntry={scriptsWikiEntry}
              l10n={l10n}
              />
          </div>
          <AttributeMods
            attributes={attributes}
            l10n={l10n}
            />
          <SkillsSheetRoutineChecks l10n={l10n} />
          <SkillsSheetQualityLevels l10n={l10n} />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
