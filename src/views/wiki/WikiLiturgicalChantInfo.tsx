import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { SecondaryAttribute, SkillExtension } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { Attribute, Book, LiturgicalChant, SpecialAbility } from '../../types/wiki';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';
import { getAspectsOfTradition, getTraditionOfAspect } from '../../utils/LiturgyUtils';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

export interface WikiLiturgicalChantInfoProps {
	attributes: Map<string, Attribute>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	currentObject: LiturgicalChant;
	locale: UIMessages;
	liturgicalChantExtensions: SpecialAbility | undefined;
}

export function WikiLiturgicalChantInfo(props: WikiLiturgicalChantInfoProps) {
	const { attributes, books, derivedCharacteristics, currentObject, liturgicalChantExtensions, locale } = props;

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
			<div className="info liturgicalchant-info">
				<div className="liturgicalchant-header info-header">
					<p className="title">{currentObject.name}</p>
				</div>
				<WikiProperty locale={locale} title="info.check">{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}</WikiProperty>
				<WikiProperty locale={locale} title="info.traditions">{traditions}</WikiProperty>
				<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
			</div>
		</Scroll>;
	}

	const filteredLiturgicalChantExtensions = liturgicalChantExtensions && (liturgicalChantExtensions.select as SkillExtension[]).filter(e => e.target === currentObject.id).sort((a, b) => a.tier - b.tier);

	switch (currentObject.gr) {
		case 1:
			return <Scroll>
				<div className="info spell-info">
					<div className="spell-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<WikiProperty locale={locale} title="info.check">
						{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}
					</WikiProperty>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<WikiProperty locale={locale} title="info.liturgicaltime">{currentObject.castingTime}</WikiProperty>
					<WikiProperty locale={locale} title="info.kpcost">{currentObject.cost}</WikiProperty>
					<WikiProperty locale={locale} title="info.range">{currentObject.range}</WikiProperty>
					<WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
					<WikiProperty locale={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
					<WikiProperty locale={locale} title="info.traditions">{traditions}</WikiProperty>
					<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
					{filteredLiturgicalChantExtensions && filteredLiturgicalChantExtensions.length === 3 && <p className="extensions-title">
						<span>{_translate(locale, 'liturgicalchantextensions')}</span>
					</p>}
					{filteredLiturgicalChantExtensions && filteredLiturgicalChantExtensions.length === 3 && <ul className="extensions">
						{filteredLiturgicalChantExtensions.map(({ cost, effect, id, name, tier }) => (
							<Markdown source={`*${name}* (${_translate(locale, 'sr.short')} ${tier * 4 + 4}, ${cost} ${_translate(locale, 'apshort')}): ${effect}`} isListElement key={id} />
						))}
					</ul>}
					<WikiSource src={currentObject.src} books={books} locale={locale} />
				</div>
			</Scroll>;
		case 2:
			return <Scroll>
				<div className="info liturgicalchant-info">
					<div className="liturgicalchant-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<WikiProperty locale={locale} title="info.check">{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}</WikiProperty>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<WikiProperty locale={locale} title="info.ceremonialtime">{currentObject.castingTime}</WikiProperty>
					<WikiProperty locale={locale} title="info.kpcost">{currentObject.cost}</WikiProperty>
					<WikiProperty locale={locale} title="info.range">{currentObject.range}</WikiProperty>
					<WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
					<WikiProperty locale={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
					<WikiProperty locale={locale} title="info.traditions">{traditions}</WikiProperty>
					<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
					{filteredLiturgicalChantExtensions && filteredLiturgicalChantExtensions.length === 3 && <p className="extensions-title">
						<span>{_translate(locale, 'liturgicalchantextensions')}</span>
					</p>}
					{filteredLiturgicalChantExtensions && filteredLiturgicalChantExtensions.length === 3 && <ul className="extensions">
						{filteredLiturgicalChantExtensions.map(({ cost, effect, id, name, tier }) => (
							<Markdown source={`*${name}* (${_translate(locale, 'sr.short')} ${tier * 4 + 4}, ${cost} ${_translate(locale, 'apshort')}): ${effect}`} isListElement key={id} />
						))}
					</ul>}
					<WikiSource src={currentObject.src} books={books} locale={locale} />
				</div>
			</Scroll>;
	}

	return null;
}
