import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { Book, CantripInstance, UIMessages } from '../../types/data.d';
import { _translate } from '../../utils/I18n';

export interface WikiCantripInfoProps {
	books: Map<string, Book>;
	currentObject: CantripInstance;
	locale: UIMessages;
}

export function WikiCantripInfo(props: WikiCantripInfoProps) {
	const { currentObject, locale } = props;

	return <Scroll>
		<div className="info cantrip-info">
			<div className="cantrip-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<Markdown source="" />
			<p>
				<span>{_translate(locale, 'info.range')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.duration')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.targetcategory')}</span>
				<span></span>
			</p>
			<p>
				<span>{_translate(locale, 'info.property')}</span>
				<span>{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.note')}</span>
				<span>{}</span>
			</p>
			<p className="source">
				<span></span>
			</p>
		</div>
	</Scroll>;
}
