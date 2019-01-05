import * as React from 'react';
import { AttributeCombined, SkillCombined } from '../../../App/Models/View/viewTypeHelpers';
import { SpecialAbility } from '../../../App/Models/Wiki/wikiTypeHelpers';
import { Checkbox } from '../../../components/Checkbox';
import { Options } from '../../../components/Options';
import { ActivatableDependent } from '../../../types/data';
import { List, Maybe, Record } from '../../../utils/dataUtils';
import { translate, UIMessagesObject } from '../../../utils/I18n';
import { AttributeMods } from '../AttributeMods';
import { Sheet } from '../Sheet';
import { SheetWrapper } from '../SheetWrapper';
import { SkillsSheetLanguages } from './SkillsSheetLanguages';
import { SkillsSheetQualityLevels } from './SkillsSheetQualityLevels';
import { SkillsSheetRoutineChecks } from './SkillsSheetRoutineChecks';
import { SkillsSheetScripts } from './SkillsSheetScripts';
import { SkillsSheetSkills } from './SkillsSheetSkills';

export interface SkillsSheetProps {
  attributes: List<Record<AttributeCombined>>;
  checkAttributeValueVisibility: boolean;
  languagesStateEntry: Maybe<Record<ActivatableDependent>>;
  languagesWikiEntry: Maybe<Record<SpecialAbility>>;
  locale: UIMessagesObject;
  scriptsStateEntry: Maybe<Record<ActivatableDependent>>;
  scriptsWikiEntry: Maybe<Record<SpecialAbility>>;
  skills: List<Record<SkillCombined>>;
  switchAttributeValueVisibility (): void;
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
  } = props;

  return (
    <SheetWrapper>
      <Options>
        <Checkbox
          checked={checkAttributeValueVisibility}
          onClick={switchAttributeValueVisibility}
          >
          {translate (locale, 'charactersheet.options.showattributevalues')}
        </Checkbox>
      </Options>
      <Sheet
        id="skills-sheet"
        title={translate (locale, 'charactersheet.gamestats.title')}
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
  );
}
