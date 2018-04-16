import * as React from 'react';
import { TextBox } from '../../components/TextBox';
import { TalentInstance } from '../../types/data.d';
import { Attribute, UIMessages } from '../../types/view.d';
import { _translate } from '../../utils/I18n';
import { iterateGroupHeaders } from './SkillsSheetSkillsGroups';
import { iterateList } from './SkillsSheetSkillsIterate';

export interface SkillsSheetSkillsProps {
	attributes: Attribute[];
	checkAttributeValueVisibility: boolean;
	locale: UIMessages;
	talents: TalentInstance[];
}

export function SkillsSheetSkills(props: SkillsSheetSkillsProps) {
	const { attributes, checkAttributeValueVisibility, locale, talents } = props;

	const talentsByGroup: TalentInstance[][] = [[], [], [], [], []];
	talents.forEach(obj => talentsByGroup[obj.gr - 1].push(obj));

	const groupHeaders = iterateGroupHeaders(attributes, checkAttributeValueVisibility, locale);

	return (
		<TextBox label={_translate(locale, 'charactersheet.gamestats.skills.title')}>
			<div className="upper">
				<table>
					<thead>
						<tr>
							<th className="name">{_translate(locale, 'charactersheet.gamestats.skills.headers.skill')}</th>
							<th className="check">{_translate(locale, 'charactersheet.gamestats.skills.headers.check')}</th>
							<th className="enc">{_translate(locale, 'charactersheet.gamestats.skills.headers.enc')}</th>
							<th className="ic">{_translate(locale, 'charactersheet.gamestats.skills.headers.ic')}</th>
							<th className="sr">{_translate(locale, 'charactersheet.gamestats.skills.headers.sr')}</th>
							<th className="routine">{_translate(locale, 'charactersheet.gamestats.skills.headers.r')}</th>
							<th className="comment">{_translate(locale, 'charactersheet.gamestats.skills.headers.notes')}</th>
						</tr>
					</thead>
					<tbody>
						{groupHeaders[0]}
						{iterateList(talentsByGroup[0], attributes, checkAttributeValueVisibility, locale)}
						<tr><td/><td/><td/><td/><td/><td/><td/></tr>
						{groupHeaders[1]}
						{iterateList(talentsByGroup[1], attributes, checkAttributeValueVisibility, locale)}
						<tr><td/><td/><td/><td/><td/><td/><td/></tr>
						{groupHeaders[2]}
						{iterateList(talentsByGroup[2], attributes, checkAttributeValueVisibility, locale)}
					</tbody>
				</table>
				<table>
					<thead>
						<tr>
							<th className="name">{_translate(locale, 'charactersheet.gamestats.skills.headers.skill')}</th>
							<th className="check">{_translate(locale, 'charactersheet.gamestats.skills.headers.check')}</th>
							<th className="enc">{_translate(locale, 'charactersheet.gamestats.skills.headers.enc')}</th>
							<th className="ic">{_translate(locale, 'charactersheet.gamestats.skills.headers.ic')}</th>
							<th className="sr">{_translate(locale, 'charactersheet.gamestats.skills.headers.sr')}</th>
							<th className="routine">{_translate(locale, 'charactersheet.gamestats.skills.headers.r')}</th>
							<th className="comment">{_translate(locale, 'charactersheet.gamestats.skills.headers.notes')}</th>
						</tr>
					</thead>
					<tbody>
						{groupHeaders[3]}
						{iterateList(talentsByGroup[3], attributes, checkAttributeValueVisibility, locale)}
						<tr><td/><td/><td/><td/><td/><td/><td/></tr>
						{groupHeaders[4]}
						{iterateList(talentsByGroup[4], attributes, checkAttributeValueVisibility, locale)}
					</tbody>
				</table>
			</div>
		</TextBox>
	);
}
