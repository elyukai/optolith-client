import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { UIMessages } from '../../types/data.d';
import { Attribute, Book, Skill } from '../../types/wiki';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';
import { WikiProperty } from './WikiProperty';

export interface WikiSkillInfoProps {
	attributes: Map<string, Attribute>;
	books: Map<string, Book>;
	currentObject: Skill;
	locale: UIMessages;
}

export function WikiSkillInfo(props: WikiSkillInfoProps) {
	const { attributes, books, currentObject, locale } = props;

	if (['en-US', 'nl-BE'].includes(locale.id)) {
		return <Scroll>
			<div className="info skill-info">
				<div className="skill-header info-header">
					<p className="title">{currentObject.name}</p>
				</div>
				<WikiProperty locale={locale} title="info.check">
					{currentObject.check.map(e => attributes.get(e)!.short).join('/')}
				</WikiProperty>
				<WikiProperty locale={locale} title="info.applications">
					{currentObject.applications && currentObject.applications.map(e => e.name).sort().join(', ')}
					{currentObject.applications && currentObject.applicationsInput && ', '}{currentObject.applicationsInput}
				</WikiProperty>
				<WikiProperty locale={locale} title="info.encumbrance">
					{currentObject.encumbrance === 'true' ? _translate(locale, 'charactersheet.gamestats.skills.enc.yes') : currentObject.encumbrance === 'false' ? _translate(locale, 'charactersheet.gamestats.skills.enc.no') : _translate(locale, 'charactersheet.gamestats.skills.enc.maybe')}
				</WikiProperty>
				<WikiProperty locale={locale} title="info.improvementcost">
					{getICName(currentObject.ic)}
				</WikiProperty>
			</div>
		</Scroll>;
	}

	return <Scroll>
		<div className="info skill-info">
			<div className="skill-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<WikiProperty locale={locale} title="info.check">
				{currentObject.check.map(e => attributes.get(e)!.short).join('/')}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.applications">
				{currentObject.applications && currentObject.applications.map(e => e.name).sort().join(', ')}
				{currentObject.applications && currentObject.applicationsInput && ', '}{currentObject.applicationsInput}
			</WikiProperty>
			<WikiProperty locale={locale} title="info.encumbrance">
				{currentObject.encumbrance === 'true' ? _translate(locale, 'charactersheet.gamestats.skills.enc.yes') : currentObject.encumbrance === 'false' ? _translate(locale, 'charactersheet.gamestats.skills.enc.no') : _translate(locale, 'charactersheet.gamestats.skills.enc.maybe')}
			</WikiProperty>
			{currentObject.tools && <Markdown source={`**${_translate(locale, 'info.tools')}:** ${currentObject.tools}`} />}
			{currentObject.quality && <Markdown source={`**${_translate(locale, 'info.quality')}:** ${currentObject.quality}`} />}
			{currentObject.failed && <Markdown source={`**${_translate(locale, 'info.failedcheck')}:** ${currentObject.failed}`} />}
			{currentObject.critical && <Markdown source={`**${_translate(locale, 'info.criticalsuccess')}:** ${currentObject.critical}`} />}
			{currentObject.botch && <Markdown source={`**${_translate(locale, 'info.botch')}:** ${currentObject.botch}`} />}
			<WikiProperty locale={locale} title="info.improvementcost">
				{getICName(currentObject.ic)}
			</WikiProperty>
			<p className="source">
				<span>{books.get('US25001')!.name} {currentObject.src}</span>
			</p>
		</div>
	</Scroll>;
}
