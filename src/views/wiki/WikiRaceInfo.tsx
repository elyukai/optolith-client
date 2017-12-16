import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { Race, UIMessages } from '../../types/view.d';
import { Book } from '../../types/wiki.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

export interface WikiRaceInfoProps {
	books: Map<string, Book>;
	currentObject: Race;
	locale: UIMessages;
}

export function WikiRaceInfo(props: WikiRaceInfoProps) {
	const { books, currentObject, locale } = props;

	if (['en-US', 'nl-BE'].includes(locale.id)) {
		return <Scroll>
			<div className="info race-info">
				<div className="race-header info-header">
					<p className="title">{currentObject.name}</p>
				</div>
				<WikiProperty locale={locale} title="info.apvalue">{currentObject.ap} {_translate(locale, 'aptext')}</WikiProperty>
				<WikiProperty locale={locale} title="info.lifepointbasevalue">{currentObject.lp}</WikiProperty>
				<WikiProperty locale={locale} title="info.spiritbasevalue">{currentObject.spi}</WikiProperty>
				<WikiProperty locale={locale} title="info.toughnessbasevalue">{currentObject.tou}</WikiProperty>
				<WikiProperty locale={locale} title="info.movementbasevalue">{currentObject.mov}</WikiProperty>
				<WikiSource src={currentObject.src} books={books} locale={locale} />
			</div>
		</Scroll>;
	}

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
			<WikiProperty locale={locale} title="info.apvalue">{currentObject.ap} {_translate(locale, 'aptext')}</WikiProperty>
			<WikiProperty locale={locale} title="info.lifepointbasevalue">{currentObject.lp}</WikiProperty>
			<WikiProperty locale={locale} title="info.spiritbasevalue">{currentObject.spi}</WikiProperty>
			<WikiProperty locale={locale} title="info.toughnessbasevalue">{currentObject.tou}</WikiProperty>
			<WikiProperty locale={locale} title="info.movementbasevalue">{currentObject.mov}</WikiProperty>
			<WikiProperty locale={locale} title="info.attributeadjustments">{currentObject.attributeAdjustments}</WikiProperty>
			{currentObject.automaticAdvantages && <WikiProperty locale={locale} title="info.automaticadvantages">
				{currentObject.automaticAdvantages}
			</WikiProperty>}
			{currentObject.stronglyRecommendedAdvantages && <WikiProperty locale={locale} title="info.stronglyrecommendedadvantages">
				{currentObject.stronglyRecommendedAdvantages}
			</WikiProperty>}
			{currentObject.stronglyRecommendedDisadvantages && <WikiProperty locale={locale} title="info.stronglyrecommendeddisadvantages">
				{currentObject.stronglyRecommendedDisadvantages}
			</WikiProperty>}
			<WikiProperty locale={locale} title="info.commoncultures">
				{sameCommonCultures && <span>{sortStrings((currentObject.commonCultures.length > 0 ? currentObject.commonCultures : currentObject.variants.map(e => e.name)), locale.id).join(', ')}</span>}
			</WikiProperty>
			{!sameCommonCultures && <ul className="race-variant-options">
				{currentObject.variants.map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{sortStrings(e.commonCultures, locale.id).join(', ')}</span>
					</li>;
				})}
			</ul>}
			<WikiProperty locale={locale} title="info.commonadvantages">
				{sameCommonAdvantages && <span>{currentObject.commonAdvantages || _translate(locale, 'info.none')}</span>}
			</WikiProperty>
			{!sameCommonAdvantages && <ul className="race-variant-options">
				{currentObject.variants.filter(e => typeof e.commonAdvantages === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.commonAdvantages}</span>
					</li>;
				})}
			</ul>}
			<WikiProperty locale={locale} title="info.commondisadvantages">
				{sameCommonDisadvantages && <span>{currentObject.commonDisadvantages || _translate(locale, 'info.none')}</span>}
			</WikiProperty>
			{!sameCommonDisadvantages && <ul className="race-variant-options">
				{currentObject.variants.filter(e => typeof e.commonDisadvantages === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.commonDisadvantages}</span>
					</li>;
				})}
			</ul>}
			<WikiProperty locale={locale} title="info.uncommonadvantages">
				{sameUncommonAdvantages && <span>{currentObject.uncommonAdvantages || _translate(locale, 'info.none')}</span>}
			</WikiProperty>
			{!sameUncommonAdvantages && <ul className="race-variant-options">
				{currentObject.variants.filter(e => typeof e.uncommonAdvantages === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.uncommonAdvantages}</span>
					</li>;
				})}
			</ul>}
			<WikiProperty locale={locale} title="info.uncommondisadvantages">
				{sameUncommonDisadvantages && <span>{currentObject.uncommonDisadvantages || _translate(locale, 'info.none')}</span>}
			</WikiProperty>
			{!sameUncommonDisadvantages && <ul className="race-variant-options">
				{currentObject.variants.filter(e => typeof e.uncommonDisadvantages === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.uncommonDisadvantages}</span>
					</li>;
				})}
			</ul>}
			<WikiSource src={currentObject.src} books={books} locale={locale} />
		</div>
	</Scroll>;
}
