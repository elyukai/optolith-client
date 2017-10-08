import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { Book, CantripInstance, UIMessages } from '../../types/data.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface WikiCantripInfoProps {
	books: Map<string, Book>;
	currentObject: CantripInstance;
	locale: UIMessages;
}

export function WikiCantripInfo(props: WikiCantripInfoProps) {
	const { books, currentObject, locale } = props;

	return <Scroll>
		<div className="info cantrip-info">
			<div className="cantrip-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<Markdown className="no-indent" source={currentObject.effect} />
			<p>
				<span>{_translate(locale, 'info.range')}</span>
				<span>{currentObject.range}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.duration')}</span>
				<span>{currentObject.duration}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.targetcategory')}</span>
				<span>{currentObject.target}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.property')}</span>
				<span>{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}</span>
			</p>
			{currentObject.note && <p>
				<span>{_translate(locale, 'info.note')}</span>
				<span>{currentObject.note}</span>
			</p>}
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
