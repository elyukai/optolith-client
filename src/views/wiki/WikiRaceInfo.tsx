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

	const sameCommonCultures = currentObject.variants.every(e => e.commonCultures.length === 0) || currentObject.variants.every(e => e.commonCultures.length === 1);
	const sameCommonAdvantages = currentObject.variants.every(e => e.commonAdvantages === undefined);
	const sameCommonDisadvantages = currentObject.variants.every(e => e.commonDisadvantages === undefined);
	const sameUncommonAdvantages = currentObject.variants.every(e => e.uncommonAdvantages === undefined);
	const sameUncommonDisadvantages = currentObject.variants.every(e => e.uncommonDisadvantages === undefined);

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
				<span>{_translate(locale, 'info.movementbasevalue')}</span>
				<span>{currentObject.mov}</span>
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
				{sameCommonCultures && <span>{sortStrings((currentObject.commonCultures.length > 0 ? currentObject.commonCultures : currentObject.variants.map(e => e.name)), locale.id).join(', ')}</span>}
			</p>
			{!sameCommonCultures && <ul className="race-variant-options">
				{currentObject.variants.map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{sortStrings(e.commonCultures, locale.id).join(', ')}</span>
					</li>;
				})}
			</ul>}
			<p>
				<span>{_translate(locale, 'info.commonadvantages')}</span>
				{sameCommonAdvantages && <span>{currentObject.commonAdvantages || _translate(locale, 'info.none')}</span>}
			</p>
			{!sameCommonAdvantages && <ul className="race-variant-options">
				{currentObject.variants.filter(e => typeof e.commonAdvantages === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.commonAdvantages}</span>
					</li>;
				})}
			</ul>}
			<p>
				<span>{_translate(locale, 'info.commondisadvantages')}</span>
				{sameCommonDisadvantages && <span>{currentObject.commonDisadvantages || _translate(locale, 'info.none')}</span>}
			</p>
			{!sameCommonDisadvantages && <ul className="race-variant-options">
				{currentObject.variants.filter(e => typeof e.commonDisadvantages === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.commonDisadvantages}</span>
					</li>;
				})}
			</ul>}
			<p>
				<span>{_translate(locale, 'info.uncommonadvantages')}</span>
				{sameUncommonAdvantages && <span>{currentObject.uncommonAdvantages || _translate(locale, 'info.none')}</span>}
			</p>
			{!sameUncommonAdvantages && <ul className="race-variant-options">
				{currentObject.variants.filter(e => typeof e.uncommonAdvantages === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.uncommonAdvantages}</span>
					</li>;
				})}
			</ul>}
			<p>
				<span>{_translate(locale, 'info.uncommondisadvantages')}</span>
				{sameUncommonDisadvantages && <span>{currentObject.uncommonDisadvantages || _translate(locale, 'info.none')}</span>}
			</p>
			{!sameUncommonDisadvantages && <ul className="race-variant-options">
				{currentObject.variants.filter(e => typeof e.uncommonDisadvantages === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.uncommonDisadvantages}</span>
					</li>;
				})}
			</ul>}
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
