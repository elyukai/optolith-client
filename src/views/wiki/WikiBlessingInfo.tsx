import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { BlessingInstance, Book, UIMessages } from '../../types/data.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getAspectsOfTradition, getTraditionOfAspect } from '../../utils/LiturgyUtils';

export interface WikiBlessingInfoProps {
	books: Map<string, Book>;
	currentObject: BlessingInstance;
	locale: UIMessages;
}

export function WikiBlessingInfo(props: WikiBlessingInfoProps) {
	const { books, currentObject, locale } = props;

		const traditionsMap = new Map<number, number[]>();

		for (const aspectId of currentObject.aspects) {
			const tradition = getTraditionOfAspect(aspectId);
			traditionsMap.set(tradition, [...(traditionsMap.get(tradition) || []), aspectId]);
		}

		const traditions = sortStrings([...traditionsMap].map(e => {
			if (getAspectsOfTradition(e[0]).length < 2) {
				return _translate(locale, 'liturgies.view.traditions')[e[0] - 1];
			}
			return `${_translate(locale, 'liturgies.view.traditions')[e[0] - 1]} (${sortStrings(e[1].map(a => _translate(locale, 'liturgies.view.aspects')[a - 1]), locale.id).join(', ')})`;
		}), locale.id).join(', ');

	return <Scroll>
		<div className="info blessing-info">
			<div className="blessing-header info-header">
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
				<span>{_translate(locale, 'info.aspect')}</span>
				<span>{traditions}</span>
			</p>
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
