import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, LiturgyInstance, SecondaryAttribute, SkillExtension, SpecialAbilityInstance } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';
import { getAspectsOfTradition, getTraditionOfAspect } from '../../utils/LiturgyUtils';

export interface WikiLiturgicalChantInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	currentObject: LiturgyInstance;
	locale: UIMessages;
	liturgicalChantExtensions: SpecialAbilityInstance | undefined;
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

	const filteredLiturgicalChantExtensions = liturgicalChantExtensions && (liturgicalChantExtensions.sel as SkillExtension[]).filter(e => e.target === currentObject.id).sort((a, b) => a.tier - b.tier);

	switch (currentObject.gr) {
		case 1:
			return <Scroll>
				<div className="info spell-info">
					<div className="spell-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<p>
						<span>{_translate(locale, 'info.check')}</span>
						<span>{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}</span>
					</p>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<p>
						<span>{_translate(locale, 'info.liturgicaltime')}</span>
						<span>{currentObject.castingTime}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.kpcost')}</span>
						<span>{currentObject.cost}</span>
					</p>
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
						<span>{_translate(locale, 'info.traditions')}</span>
						<span>{traditions}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.improvementcost')}</span>
						<span>{getICName(currentObject.ic)}</span>
					</p>
					{filteredLiturgicalChantExtensions && filteredLiturgicalChantExtensions.length === 3 && <p className="extensions-title">
						<span>{_translate(locale, 'liturgicalchantextensions')}</span>
					</p>}
					{filteredLiturgicalChantExtensions && filteredLiturgicalChantExtensions.length === 3 && <ul className="extensions">
						{filteredLiturgicalChantExtensions.map(({ cost, effect, id, name, tier }) => (
							<Markdown source={`*${name}* (${_translate(locale, 'sr.short')} ${tier * 4 + 4}, ${cost} ${_translate(locale, 'apshort')}): ${effect}`} isListElement key={id} />
						))}
					</ul>}
					<p className="source">
						<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
					</p>
				</div>
			</Scroll>;
		case 2:
			return <Scroll>
				<div className="info spell-info">
					<div className="spell-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<p>
						<span>{_translate(locale, 'info.check')}</span>
						<span>{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}</span>
					</p>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<p>
						<span>{_translate(locale, 'info.ceremonialtime')}</span>
						<span>{currentObject.castingTime}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.kpcost')}</span>
						<span>{currentObject.cost}</span>
					</p>
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
						<span>{_translate(locale, 'info.traditions')}</span>
						<span>{traditions}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.improvementcost')}</span>
						<span>{getICName(currentObject.ic)}</span>
					</p>
					{filteredLiturgicalChantExtensions && filteredLiturgicalChantExtensions.length === 3 && <p className="extensions-title">
						<span>{_translate(locale, 'liturgicalchantextensions')}</span>
					</p>}
					{filteredLiturgicalChantExtensions && filteredLiturgicalChantExtensions.length === 3 && <ul className="extensions">
						{filteredLiturgicalChantExtensions.map(({ cost, effect, id, name, tier }) => (
							<Markdown source={`*${name}* (${_translate(locale, 'sr.short')} ${tier * 4 + 4}, ${cost} ${_translate(locale, 'apshort')}): ${effect}`} isListElement key={id} />
						))}
					</ul>}
					<p className="source">
						<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
					</p>
				</div>
			</Scroll>;
	}

	return null;
}
