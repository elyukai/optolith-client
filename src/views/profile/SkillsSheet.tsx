import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { SpecialAbilityInstance, TalentInstance, UIMessages } from '../../types/data.d';
import { Attribute } from '../../types/view.d';
import { _translate } from '../../utils/I18n';
import { AttributeMods } from './AttributeMods';
import { Sheet } from './Sheet';
import { SheetOptions } from './SheetOptions';
import { SheetWrapper } from './SheetWrapper';
import { SkillsSheetLanguages } from './SkillsSheetLanguages';
import { SkillsSheetQualityLevels } from './SkillsSheetQualityLevels';
import { SkillsSheetRoutineChecks } from './SkillsSheetRoutineChecks';
import { SkillsSheetScripts } from './SkillsSheetScripts';
import { SkillsSheetSkills } from './SkillsSheetSkills';

export interface SkillsSheetProps {
	attributes: Attribute[];
	checkAttributeValueVisibility: boolean;
	languagesInstance: SpecialAbilityInstance;
	locale: UIMessages;
	scriptsInstance: SpecialAbilityInstance;
	talents: TalentInstance[];
	switchAttributeValueVisibility(): void;
}

export function SkillsSheet(props: SkillsSheetProps) {
	const { attributes, checkAttributeValueVisibility, languagesInstance, locale, scriptsInstance, switchAttributeValueVisibility, talents } = props;
	return (
		<SheetWrapper>
			<SheetOptions>
				<Checkbox
					checked={checkAttributeValueVisibility}
					onClick={switchAttributeValueVisibility}
					>
					{_translate(locale, 'charactersheet.options.showattributevalues')}
				</Checkbox>
			</SheetOptions>
			<Sheet
				id="skills-sheet"
				title={_translate(locale, 'charactersheet.gamestats.title')}
				attributes={attributes}
				locale={locale}
				>
				<SkillsSheetSkills
					attributes={attributes}
					checkAttributeValueVisibility={checkAttributeValueVisibility}
					locale={locale}
					talents={talents}
					/>
				<div className="lower">
					<div className="abilites">
						<SkillsSheetLanguages
							languagesInstance={languagesInstance}
							locale={locale}
							/>
						<SkillsSheetScripts
							scriptsInstance={scriptsInstance}
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
