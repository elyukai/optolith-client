import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, SecondaryAttribute, SkillExtension, SpecialAbilityInstance, SpellInstance } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';
import { WikiProperty } from './WikiProperty';
import { WikiSource } from './WikiSource';

export interface WikiSpellInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	currentObject: SpellInstance;
	locale: UIMessages;
	spellExtensions: SpecialAbilityInstance | undefined;
}

export function WikiSpellInfo(props: WikiSpellInfoProps) {
	const { attributes, books, derivedCharacteristics, currentObject, locale, spellExtensions } = props;

	if (['en-US', 'nl-BE'].includes(locale.id)) {
		return <Scroll>
			<div className="info spell-info">
				<div className="spell-header info-header">
					<p className="title">{currentObject.name}</p>
				</div>
				<WikiProperty locale={locale} title="info.check">
					{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}
				</WikiProperty>
				<WikiProperty locale={locale} title="info.property">
					{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
				</WikiProperty>
				<WikiProperty locale={locale} title="info.traditions">
					{sortStrings(currentObject.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]), locale.id).join(', ')}
				</WikiProperty>
				<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
			</div>
		</Scroll>;
	}

	const filteredSpellExtensions = spellExtensions && (spellExtensions.sel as SkillExtension[]).filter(e => e.target === currentObject.id).sort((a, b) => a.tier - b.tier);

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
					<WikiProperty locale={locale} title="info.castingtime">{currentObject.castingTime}</WikiProperty>
					<WikiProperty locale={locale} title="info.aecost">{currentObject.cost}</WikiProperty>
					<WikiProperty locale={locale} title="info.range">{currentObject.range}</WikiProperty>
					<WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
					<WikiProperty locale={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
					<WikiProperty locale={locale} title="info.property">
						{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.traditions">
						{sortStrings(currentObject.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]), locale.id).join(', ')}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
					{filteredSpellExtensions && filteredSpellExtensions.length === 3 && <p className="extensions-title">
						<span>{_translate(locale, 'spellextensions')}</span>
					</p>}
					{filteredSpellExtensions && filteredSpellExtensions.length === 3 && <ul className="extensions">
						{filteredSpellExtensions.map(({ cost, effect, id, name, tier }) => (
							<Markdown source={`*${name}* (${_translate(locale, 'sr.short')} ${tier * 4 + 4}, ${cost} ${_translate(locale, 'apshort')}): ${effect}`} isListElement key={id} />
						))}
					</ul>}
					<WikiSource src={currentObject.src} books={books} locale={locale} />
				</div>
			</Scroll>;
		case 2:
			return <Scroll>
				<div className="info spell-info">
					<div className="spell-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<WikiProperty locale={locale} title="info.check">
						{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}
					</WikiProperty>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<WikiProperty locale={locale} title="info.ritualtime">{currentObject.castingTime}</WikiProperty>
					<WikiProperty locale={locale} title="info.aecost">{currentObject.cost}</WikiProperty>
					<WikiProperty locale={locale} title="info.range">{currentObject.range}</WikiProperty>
					<WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
					<WikiProperty locale={locale} title="info.targetcategory">{currentObject.target}</WikiProperty>
					<WikiProperty locale={locale} title="info.property">
						{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.traditions">
						{sortStrings(currentObject.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]), locale.id).join(', ')}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
					{filteredSpellExtensions && filteredSpellExtensions.length === 3 && <p className="extensions-title">
						<span>{_translate(locale, 'spellextensions')}</span>
					</p>}
					{filteredSpellExtensions && filteredSpellExtensions.length === 3 && <ul className="extensions">
						{filteredSpellExtensions.map(({ cost, effect, id, name, tier }) => (
							<Markdown source={`*${name}* (${_translate(locale, 'sr.short')} ${tier * 4 + 4}, ${cost} ${_translate(locale, 'apshort')}): ${effect}`} isListElement key={id} />
						))}
					</ul>}
					<WikiSource src={currentObject.src} books={books} locale={locale} />
				</div>
			</Scroll>;
		case 3:
			return <Scroll>
				<div className="info spell-info">
					<div className="spell-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<WikiProperty locale={locale} title="info.check">
						{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}
					</WikiProperty>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<WikiProperty locale={locale} title="info.aecost">{currentObject.cost}</WikiProperty>
					<WikiProperty locale={locale} title="info.duration">{currentObject.duration}</WikiProperty>
					<WikiProperty locale={locale} title="info.property">
						{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
					</WikiProperty>
					<WikiSource src={currentObject.src} books={books} locale={locale} />
				</div>
			</Scroll>;
		case 4:
			return <Scroll>
				<div className="info spell-info">
					<div className="spell-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<WikiProperty locale={locale} title="info.check">
						{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}
					</WikiProperty>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<WikiProperty locale={locale} title="info.skill">{currentObject.duration}</WikiProperty>
					<WikiProperty locale={locale} title="info.aecost">{currentObject.cost}</WikiProperty>
					<WikiProperty locale={locale} title="info.property">
						{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
					<WikiSource src={currentObject.src} books={books} locale={locale} />
				</div>
			</Scroll>;
		case 5:
			return <Scroll>
				<div className="info spell-info">
					<div className="spell-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<WikiProperty locale={locale} title="info.check">
						{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}
					</WikiProperty>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<WikiProperty locale={locale} title="info.lengthoftime">{currentObject.castingTime}</WikiProperty>
					<WikiProperty locale={locale} title="info.skill">{currentObject.duration}</WikiProperty>
					<WikiProperty locale={locale} title="info.aecost">{currentObject.cost}</WikiProperty>
					<WikiProperty locale={locale} title="info.property">
						{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.musictradition">
						{sortStrings(currentObject.subtradition.map(e => _translate(locale, 'musictraditions')[e - 1]), locale.id).join(', ')}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.improvementcost">{getICName(currentObject.ic)}</WikiProperty>
					<WikiSource src={currentObject.src} books={books} locale={locale} />
				</div>
			</Scroll>;
		case 6:
			return <Scroll>
				<div className="info spell-info">
					<div className="spell-header info-header">
						<p className="title">{currentObject.name}</p>
					</div>
					<WikiProperty locale={locale} title="info.check">
						{currentObject.check.map(e => attributes.get(e)!.short).join('/')}{currentObject.checkmod && ` (+${derivedCharacteristics.get(currentObject.checkmod)!.short})`}
					</WikiProperty>
					{currentObject.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${currentObject.effect}`} />}
					<WikiProperty locale={locale} title="info.lengthoftime">
						{currentObject.castingTime}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.aecost">
						{currentObject.cost}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.property">
						{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.musictradition">
						{sortStrings(currentObject.subtradition.map(e => _translate(locale, 'musictraditions')[e - 1]), locale.id).join(', ')}
					</WikiProperty>
					<WikiProperty locale={locale} title="info.improvementcost">
						{getICName(currentObject.ic)}
					</WikiProperty>
					<WikiSource src={currentObject.src} books={books} locale={locale} />
				</div>
			</Scroll>;
	}

	return null;
}
