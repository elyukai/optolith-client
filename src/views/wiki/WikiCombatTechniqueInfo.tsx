import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, CombatTechniqueInstance, UIMessages } from '../../types/data.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';

export interface WikiCombatTechniqueInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	currentObject: CombatTechniqueInstance;
	locale: UIMessages;
	sex: 'm' | 'f' | undefined;
}

export function WikiCombatTechniqueInfo(props: WikiCombatTechniqueInfoProps) {
	const { attributes, books, currentObject, locale } = props;

	return <Scroll>
		<div className="info combattechnique-info">
			<div className="combattechnique-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			{currentObject.special && <Markdown source={`**${_translate(locale, 'info.special')}:** ${currentObject.special}`} />}
			<p>
				<span>{_translate(locale, 'primaryattribute.long')}</span>
				<span>{currentObject.primary.map(e => attributes.has(e) ? attributes.get(e)!.name : '...').join('/')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.improvementcost')}</span>
				<span>{getICName(currentObject.ic)}</span>
			</p>
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
