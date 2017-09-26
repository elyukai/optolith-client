import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, SecondaryAttribute, SpellInstance } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';

export interface WikiSpellInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	currentObject: SpellInstance;
	locale: UIMessages;
}

export function WikiSpellInfo(props: WikiSpellInfoProps) {
	const { attributes, books, derivedCharacteristics, currentObject, locale } = props;

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
						<span>{_translate(locale, 'info.castingtime')}</span>
						<span>{currentObject.castingTime}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.aecost')}</span>
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
						<span>{_translate(locale, 'info.property')}</span>
						<span>{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.traditions')}</span>
						<span>{sortStrings(currentObject.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]), locale.id).join(', ')}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.improvementcost')}</span>
						<span>{getICName(currentObject.ic)}</span>
					</p>
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
						<span>{_translate(locale, 'info.ritualtime')}</span>
						<span>{currentObject.castingTime}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.aecost')}</span>
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
						<span>{_translate(locale, 'info.property')}</span>
						<span>{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.traditions')}</span>
						<span>{sortStrings(currentObject.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]), locale.id).join(', ')}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.improvementcost')}</span>
						<span>{getICName(currentObject.ic)}</span>
					</p>
					<p className="source">
						<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
					</p>
				</div>
			</Scroll>;
		case 3:
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
						<span>{_translate(locale, 'info.aecost')}</span>
						<span>{currentObject.cost}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.duration')}</span>
						<span>{currentObject.duration}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.property')}</span>
						<span>{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}</span>
					</p>
					<p className="source">
						<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
					</p>
				</div>
			</Scroll>;
		case 4:
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
						<span>{_translate(locale, 'info.skill')}</span>
						<span>{currentObject.duration}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.aecost')}</span>
						<span>{currentObject.cost}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.property')}</span>
						<span>{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.improvementcost')}</span>
						<span>{getICName(currentObject.ic)}</span>
					</p>
					<p className="source">
						<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
					</p>
				</div>
			</Scroll>;
		case 5:
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
						<span>{_translate(locale, 'info.lengthoftime')}</span>
						<span>{currentObject.castingTime}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.skill')}</span>
						<span>{currentObject.duration}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.aecost')}</span>
						<span>{currentObject.cost}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.property')}</span>
						<span>{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.musictradition')}</span>
						<span>{sortStrings(currentObject.subtradition.map(e => _translate(locale, 'musictraditions')[e - 1]), locale.id).join(', ')}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.improvementcost')}</span>
						<span>{getICName(currentObject.ic)}</span>
					</p>
					<p className="source">
						<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
					</p>
				</div>
			</Scroll>;
		case 6:
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
						<span>{_translate(locale, 'info.lengthoftime')}</span>
						<span>{currentObject.castingTime}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.aecost')}</span>
						<span>{currentObject.cost}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.property')}</span>
						<span>{_translate(locale, 'spells.view.properties')[currentObject.property - 1]}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.musictradition')}</span>
						<span>{sortStrings(currentObject.subtradition.map(e => _translate(locale, 'musictraditions')[e - 1]), locale.id).join(', ')}</span>
					</p>
					<p>
						<span>{_translate(locale, 'info.improvementcost')}</span>
						<span>{getICName(currentObject.ic)}</span>
					</p>
					<p className="source">
						<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
					</p>
				</div>
			</Scroll>;
	}

	return null;
}
