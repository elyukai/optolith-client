import * as React from 'react';
import { Scroll } from '../../components/Scroll';
import { Book, Race, RaceVariant } from '../../types/wiki';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate, UIMessages } from '../../utils/I18n';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

export interface WikiRaceInfoProps {
	books: Map<string, Book>;
	currentObject: Race;
	locale: UIMessages;
	raceVariants: Map<string, RaceVariant>;
}

export function WikiRaceInfo(props: WikiRaceInfoProps) {
	const { books, currentObject, locale, raceVariants } = props;

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

	const variants = currentObject.variants.filter(v => raceVariants.has(v)).map(v => raceVariants.get(v)!);

	const sameCommonCultures = variants.every(e => e.commonCultures.length === 0) || variants.every(e => e.commonCultures.length === 1);
	const sameCommonAdvantages = variants.every(e => e.commonAdvantagesText === undefined);
	const sameCommonDisadvantages = variants.every(e => e.commonDisadvantagesText === undefined);
	const sameUncommonAdvantages = variants.every(e => e.uncommonAdvantagesText === undefined);
	const sameUncommonDisadvantages = variants.every(e => e.uncommonDisadvantagesText === undefined);

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
			<WikiProperty locale={locale} title="info.attributeadjustments">{currentObject.attributeAdjustmentsText}</WikiProperty>
			{currentObject.automaticAdvantagesText && <WikiProperty locale={locale} title="info.automaticadvantages">
				{currentObject.automaticAdvantagesText}
			</WikiProperty>}
			{currentObject.stronglyRecommendedAdvantagesText && <WikiProperty locale={locale} title="info.stronglyrecommendedadvantages">
				{currentObject.stronglyRecommendedAdvantagesText}
			</WikiProperty>}
			{currentObject.stronglyRecommendedDisadvantagesText && <WikiProperty locale={locale} title="info.stronglyrecommendeddisadvantages">
				{currentObject.stronglyRecommendedDisadvantagesText}
			</WikiProperty>}
			<WikiProperty locale={locale} title="info.commoncultures">
				{sameCommonCultures && <span>{sortStrings((currentObject.commonCultures.length > 0 ? currentObject.commonCultures : variants.map(e => e.name)), locale.id).join(', ')}</span>}
			</WikiProperty>
			{!sameCommonCultures && <ul className="race-variant-options">
				{variants.map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{sortStrings(e.commonCultures, locale.id).join(', ')}</span>
					</li>;
				})}
			</ul>}
			<WikiProperty locale={locale} title="info.commonadvantages">
				{sameCommonAdvantages && <span>{currentObject.commonAdvantagesText || _translate(locale, 'info.none')}</span>}
			</WikiProperty>
			{!sameCommonAdvantages && <ul className="race-variant-options">
				{variants.filter(e => typeof e.commonAdvantagesText === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.commonAdvantagesText}</span>
					</li>;
				})}
			</ul>}
			<WikiProperty locale={locale} title="info.commondisadvantages">
				{sameCommonDisadvantages && <span>{currentObject.commonDisadvantagesText || _translate(locale, 'info.none')}</span>}
			</WikiProperty>
			{!sameCommonDisadvantages && <ul className="race-variant-options">
				{variants.filter(e => typeof e.commonDisadvantagesText === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.commonDisadvantagesText}</span>
					</li>;
				})}
			</ul>}
			<WikiProperty locale={locale} title="info.uncommonadvantages">
				{sameUncommonAdvantages && <span>{currentObject.uncommonAdvantagesText || _translate(locale, 'info.none')}</span>}
			</WikiProperty>
			{!sameUncommonAdvantages && <ul className="race-variant-options">
				{variants.filter(e => typeof e.uncommonAdvantagesText === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.uncommonAdvantagesText}</span>
					</li>;
				})}
			</ul>}
			<WikiProperty locale={locale} title="info.uncommondisadvantages">
				{sameUncommonDisadvantages && <span>{currentObject.uncommonDisadvantagesText || _translate(locale, 'info.none')}</span>}
			</WikiProperty>
			{!sameUncommonDisadvantages && <ul className="race-variant-options">
				{variants.filter(e => typeof e.uncommonDisadvantagesText === 'string').map(e => {
					return <li key={e.id}>
						<span>{e.name}</span>
						<span>{e.uncommonDisadvantagesText}</span>
					</li>;
				})}
			</ul>}
			<WikiSource src={currentObject.src} books={books} locale={locale} />
		</div>
	</Scroll>;
}
