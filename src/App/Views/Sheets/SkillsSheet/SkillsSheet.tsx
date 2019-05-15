import * as React from "react";
import { ActivatableDependent } from "../../../Models/Hero/heroTypeHelpers";
import { AttributeCombined, SkillCombined } from "../../../Models/View/viewTypeHelpers";
import { SpecialAbility } from "../../../Models/Wiki/wikiTypeHelpers";
import { translate, UIMessagesObject } from "../../../Utilities/I18n";
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
  locale: UIMessagesObject
  scriptsStateEntry: Maybe<Record<ActivatableDependent>>
  scriptsWikiEntry: Maybe<Record<SpecialAbility>>
  skills: List<Record<SkillCombined>>
  switchAttributeValueVisibility (): void
}

export function SkillsSheet (props: SkillsSheetProps) {
  const {
    attributes,
    checkAttributeValueVisibility,
    languagesStateEntry,
    languagesWikiEntry,
    locale,
    scriptsStateEntry,
    scriptsWikiEntry,
    skills,
    switchAttributeValueVisibility,
  } = props

  return (
    <SheetWrapper>
      <Options>
        <Checkbox
          checked={checkAttributeValueVisibility}
          onClick={switchAttributeValueVisibility}
          >
          {translate (l10n) ("charactersheet.options.showattributevalues")}
        </Checkbox>
      </Options>
      <Sheet
        id="skills-sheet"
        title={translate (l10n) ("charactersheet.gamestats.title")}
        attributes={attributes}
        locale={locale}
        >
        <SkillsSheetSkills
          attributes={attributes}
          checkAttributeValueVisibility={checkAttributeValueVisibility}
          locale={locale}
          skills={skills}
          />
        <div className="lower">
          <div className="abilites">
            <SkillsSheetLanguages
              languagesStateEntry={languagesStateEntry}
              languagesWikiEntry={languagesWikiEntry}
              locale={locale}
              />
            <SkillsSheetScripts
              scriptsStateEntry={scriptsStateEntry}
              scriptsWikiEntry={scriptsWikiEntry}
              locale={locale}
              />
          </div>
          <AttributeMods
            attributes={attributes}
            locale={locale}
            />
          <SkillsSheetRoutineChecks locale={locale} />
          <SkillsSheetQualityLevels locale={locale} />
        </div>
      </Sheet>
    </SheetWrapper>
  )
}
