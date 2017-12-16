import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { Book, Cantrip } from '../../types/wiki';
import { _translate, UIMessages } from '../../utils/I18n';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

export interface WikiCantripInfoProps {
	books: Map<string, Book>;
	currentObject: Cantrip;
	locale: UIMessages;
}

export function WikiCantripInfo(props: WikiCantripInfoProps) {
	const { books, currentObject, locale } = props;

	if (['en-US', 'nl-BE'].includes(locale.id)) {
		return <Scroll>
			<div className="info cantrip-info">
				<div className="cantrip-header info-header">
					<p className="title">{currentObject.name}</p>
					<WikiProperty locale={locale} title="info.property">
						{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
					</WikiProperty>
				</div>
			</div>
		</Scroll>;
	}

	return <Scroll>
		<div className="info cantrip-info">
			<div className="cantrip-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<Markdown className="no-indent" source={currentObject.effect} />
			<WikiProperty locale={locale} title="info.range">{currentObject.range}</WikiProperty>
			<WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
			<WikiProperty locale={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
			<WikiProperty locale={locale} title="info.property">
				{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
			</WikiProperty>
			{currentObject.note && <WikiProperty locale={locale} title="info.note">{currentObject.note}</WikiProperty>}
			<WikiSource src={currentObject.src} books={books} locale={locale} />
		</div>
	</Scroll>;
}
