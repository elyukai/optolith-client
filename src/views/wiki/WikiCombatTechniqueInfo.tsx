import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, CombatTechniqueInstance, UIMessages } from '../../types/data.d';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

export interface WikiCombatTechniqueInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	currentObject: CombatTechniqueInstance;
	locale: UIMessages;
	sex: 'm' | 'f' | undefined;
}

export function WikiCombatTechniqueInfo(props: WikiCombatTechniqueInfoProps) {
	const { attributes, books, currentObject, locale } = props;

	if (['en-US', 'nl-BE'].includes(locale.id)) {
		return <Scroll>
			<div className="info combattechnique-info">
				<div className="combattechnique-header info-header">
					<p className="title">{currentObject.name}</p>
					<WikiProperty locale={locale} title="primaryattribute.long">{currentObject.primary.map(e => attributes.has(e) ? attributes.get(e)!.name : '...').join('/')}</WikiProperty>
					<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
				</div>
			</div>
		</Scroll>;
	}

	return <Scroll>
		<div className="info combattechnique-info">
			<div className="combattechnique-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			{currentObject.special && <Markdown source={`**${_translate(locale, 'info.special')}:** ${currentObject.special}`} />}
			<WikiProperty locale={locale} title="primaryattribute.long">{currentObject.primary.map(e => attributes.has(e) ? attributes.get(e)!.name : '...').join('/')}</WikiProperty>
			<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
			<WikiSource src={currentObject.src} books={books} locale={locale} />
		</div>
	</Scroll>;
}
