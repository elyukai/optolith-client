import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { BlessingInstance, Book, UIMessages } from '../../types/data.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getAspectsOfTradition, getTraditionOfAspect } from '../../utils/LiturgyUtils';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

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

	if (['en-US', 'nl-BE'].includes(locale.id)) {
		return <Scroll>
			<div className="info blessing-info">
				<div className="blessing-header info-header">
					<p className="title">{currentObject.name}</p>
					<WikiProperty locale={locale} title="info.aspect">{traditions}</WikiProperty>
				</div>
			</div>
		</Scroll>;
	}

	return <Scroll>
		<div className="info blessing-info">
			<div className="blessing-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<Markdown className="no-indent" source={currentObject.effect} />
			<WikiProperty locale={locale} title="info.range">{currentObject.range}</WikiProperty>
			<WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
			<WikiProperty locale={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
			<WikiProperty locale={locale} title="info.aspect">{traditions}</WikiProperty>
			<WikiSource src={currentObject.src} books={books} locale={locale} />
		</div>
	</Scroll>;
}
