import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, TalentInstance, UIMessages } from '../../types/data.d';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';

export interface WikiSkillInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	currentObject: TalentInstance;
	locale: UIMessages;
}

export function WikiSkillInfo(props: WikiSkillInfoProps) {
	const { attributes, currentObject, locale } = props;

	return <Scroll>
		<div className="info skill-info">
			<div className="skill-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<p>
				<span>{_translate(locale, 'info.check')}</span>
				<span>{currentObject.check.map(e => attributes.get(e)!.short).join('/')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.applications')}</span>
				<span>{currentObject.applications && currentObject.applications.map(e => e.name).sort().join(', ')}{currentObject
					.applications && currentObject.applicationsInput && ', '}{currentObject.applicationsInput}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.encumbrance')}</span>
				<span>{currentObject.encumbrance === 'true' ? _translate(locale, 'charactersheet.gamestats.skills.enc.yes') : currentObject.encumbrance === 'false' ? _translate(locale, 'charactersheet.gamestats.skills.enc.no') : _translate(locale, 'charactersheet.gamestats.skills.enc.maybe')}</span>
			</p>
			{currentObject.tools && <Markdown source={`**${_translate(locale, 'info.tools')}:** ${currentObject.tools}`} />}
			{currentObject.quality && <Markdown source={`**${_translate(locale, 'info.quality')}:** ${currentObject.quality}`} />}
			{currentObject.failed && <Markdown source={`**${_translate(locale, 'info.failedcheck')}:** ${currentObject.failed}`} />}
			{currentObject.critical && <Markdown source={`**${_translate(locale, 'info.criticalsuccess')}:** ${currentObject.critical}`} />}
			{currentObject.botch && <Markdown source={`**${_translate(locale, 'info.botch')}:** ${currentObject.botch}`} />}
			<p>
				<span>{_translate(locale, 'info.improvementcost')}</span>
				<span>{getICName(currentObject.ic)}</span>
			</p>
		</div>
	</Scroll>;
}
