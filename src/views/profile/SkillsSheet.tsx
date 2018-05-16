import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Options } from '../../components/Options';
import { SpecialAbilityInstance, TalentInstance, UIMessages } from '../../types/data.d';
import { Attribute } from '../../types/view.d';
import { translate } from '../../utils/I18n';
import { AttributeMods } from './AttributeMods';
import { Sheet } from './Sheet';
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
			<Options>
				<Checkbox
					checked={checkAttributeValueVisibility}
					onClick={switchAttributeValueVisibility}
					>
					{translate(locale, 'charactersheet.options.showattributevalues')}
				</Checkbox>
			</Options>
			<Sheet
				id="skills-sheet"
				title={translate(locale, 'charactersheet.gamestats.title')}
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
