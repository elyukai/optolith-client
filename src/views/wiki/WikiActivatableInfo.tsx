import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, SecondaryAttribute, SpecialAbilityInstance } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface WikiActivatableInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	currentObject: SpecialAbilityInstance;
	locale: UIMessages;
}

export function WikiActivatableInfo(props: WikiActivatableInfoProps) {
	const { books, currentObject, locale } = props;

	return <Scroll>
		<div className="info specialability-info">
			<div className="specialability-header info-header">
				<p className="title">{currentObject.name}</p>
				{currentObject.subgr && <p className="title">{_translate(locale, 'info.specialabilities.subgroups')[currentObject.subgr - 1]}</p>}
			</div>
			<Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />
			{currentObject.penalty && <Markdown source={`**${_translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
			{currentObject.combatTechniques && <Markdown source={`**${_translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
			<p>
				<span>{_translate(locale, 'info.apvalue')}</span>
				<span>{currentObject.cost} {_translate(locale, 'aptext')} {currentObject.apValueAppend}</span>
			</p>
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
