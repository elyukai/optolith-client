import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { Book, Race, UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';

export interface WikiRaceInfoProps {
	books: Map<string, Book>;
	currentObject: Race;
	locale: UIMessages;
}

export function WikiRaceInfo(props: WikiRaceInfoProps) {
	const { books, currentObject, locale } = props;

	return <Scroll>
		<div className="info race-info">
			<div className="race-header info-header">
				<p className="title">{currentObject.name}</p>
			</div>
			<p>
				<span>{_translate(locale, 'info.apvalue')}</span>
				<span>{currentObject.ap} {_translate(locale, 'aptext')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.lifepointbasevalue')}</span>
				<span>{currentObject.lp}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.spiritbasevalue')}</span>
				<span>{currentObject.spi}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.toughnessbasevalue')}</span>
				<span>{currentObject.tou}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.attributeadjustments')}</span>
				<span>{currentObject.attributeAdjustments}</span>
			</p>
			{currentObject.automaticAdvantages && <p>
				<span>{_translate(locale, 'info.automaticadvantages')}</span>
				<span>{currentObject.automaticAdvantages}</span>
			</p>}
			{currentObject.stronglyRecommendedAdvantages && <p>
				<span>{_translate(locale, 'info.stronglyrecommendedadvantages')}</span>
				<span>{currentObject.stronglyRecommendedAdvantages}</span>
			</p>}
			{currentObject.stronglyRecommendedDisadvantages && <p>
				<span>{_translate(locale, 'info.stronglyrecommendeddisadvantages')}</span>
				<span>{currentObject.stronglyRecommendedDisadvantages}</span>
			</p>}
			<p>
				<span>{_translate(locale, 'info.commoncultures')}</span>
				<span>{sortStrings(currentObject.commonCultures, locale.id).join(', ')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.commonadvantages')}</span>
				<span>{currentObject.commonAdvantages || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.commondisadvantages')}</span>
				<span>{currentObject.commonDisadvantages || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.uncommonadvantages')}</span>
				<span>{currentObject.uncommonAdvantages || _translate(locale, 'info.none')}</span>
			</p>
			<p>
				<span>{_translate(locale, 'info.uncommondisadvantages')}</span>
				<span>{currentObject.uncommonDisadvantages || _translate(locale, 'info.none')}</span>
			</p>
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
