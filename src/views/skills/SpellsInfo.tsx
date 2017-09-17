import * as React from 'react';
import { Aside } from '../../components/Aside';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, CantripInstance, SecondaryAttribute, SpellInstance } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';

export interface SpellsInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	list: (CantripInstance | SpellInstance)[];
	currentId?: string;
	locale: UIMessages;
}

export function SpellsInfo(props: SpellsInfoProps) {
	const { attributes, books, currentId, derivedCharacteristics, locale, list } = props;

	const spell = currentId && list.find(e => currentId === e.id);

	if (spell && spell.category === 'SPELLS') {
		switch (spell.gr) {
			case 1:
				return <Aside>
					<Scroll>
						<div className="info spell-info">
							<div className="spell-header info-header">
								<p className="title">{spell.name}</p>
							</div>
							<p>
								<span>{_translate(locale, 'info.check')}</span>
								<span>{spell.check.map(e => attributes.get(e)!.short).join('/')}{spell.checkmod && ` (+${derivedCharacteristics.get(spell.checkmod)!.short})`}</span>
							</p>
							{spell.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${spell.effect}`} />}
							<p>
								<span>{_translate(locale, 'info.castingtime')}</span>
								<span>{spell.castingTime}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.aecost')}</span>
								<span>{spell.cost}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.range')}</span>
								<span>{spell.range}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.duration')}</span>
								<span>{spell.duration}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.targetcategory')}</span>
								<span>{spell.target}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.property')}</span>
								<span>{_translate(locale, 'spells.view.properties')[spell.property - 1]}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.traditions')}</span>
								<span>{sortStrings(spell.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]), locale.id).join(', ')}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.improvementcost')}</span>
								<span>{getICName(spell.ic)}</span>
							</p>
							<p className="source">
								<span>{sortStrings(spell.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
							</p>
						</div>
					</Scroll>
				</Aside>;
			case 2:
				return <Aside>
					<Scroll>
						<div className="info spell-info">
							<div className="spell-header info-header">
								<p className="title">{spell.name}</p>
							</div>
							<p>
								<span>{_translate(locale, 'info.check')}</span>
								<span>{spell.check.map(e => attributes.get(e)!.short).join('/')}{spell.checkmod && ` (+${derivedCharacteristics.get(spell.checkmod)!.short})`}</span>
							</p>
							{spell.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${spell.effect}`} />}
							<p>
								<span>{_translate(locale, 'info.ritualtime')}</span>
								<span>{spell.castingTime}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.aecost')}</span>
								<span>{spell.cost}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.range')}</span>
								<span>{spell.range}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.duration')}</span>
								<span>{spell.duration}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.targetcategory')}</span>
								<span>{spell.target}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.property')}</span>
								<span>{_translate(locale, 'spells.view.properties')[spell.property - 1]}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.traditions')}</span>
								<span>{sortStrings(spell.tradition.map(e => _translate(locale, 'spells.view.traditions')[e - 1]), locale.id).join(', ')}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.improvementcost')}</span>
								<span>{getICName(spell.ic)}</span>
							</p>
							<p className="source">
								<span>{sortStrings(spell.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
							</p>
						</div>
					</Scroll>
				</Aside>;
			case 3:
				return <Aside>
					<Scroll>
						<div className="info spell-info">
							<div className="spell-header info-header">
								<p className="title">{spell.name}</p>
							</div>
							<p>
								<span>{_translate(locale, 'info.check')}</span>
								<span>{spell.check.map(e => attributes.get(e)!.short).join('/')}{spell.checkmod && ` (+${derivedCharacteristics.get(spell.checkmod)!.short})`}</span>
							</p>
							{spell.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${spell.effect}`} />}
							<p>
								<span>{_translate(locale, 'info.aecost')}</span>
								<span>{spell.cost}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.duration')}</span>
								<span>{spell.duration}</span>
							</p>
							<p>
								<span>{_translate(locale, 'info.property')}</span>
								<span>{_translate(locale, 'spells.view.properties')[spell.property - 1]}</span>
							</p>
							<p className="source">
								<span>{sortStrings(spell.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
							</p>
						</div>
					</Scroll>
				</Aside>;
			case 4:
				return <Aside>
					<Scroll>
						<div className="info spell-info">
							<div className="spell-header info-header">
								<p className="title">{spell.name}</p>
							</div>
							<p>
								<span>{_translate(locale, 'info.check')}</span>
								<span>{spell.check.map(e => attributes.get(e)!.short).join('/')}{spell.checkmod && ` (+${derivedCharacteristics.get(spell.checkmod)!.short})`}</span>
							</p>
							{spell.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${spell.effect}`} />}
							<p className="source">
								<span>{sortStrings(spell.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
							</p>
						</div>
					</Scroll>
				</Aside>;
			case 5:
				return <Aside>
					<Scroll>
						<div className="info spell-info">
							<div className="spell-header info-header">
								<p className="title">{spell.name}</p>
							</div>
							<p>
								<span>{_translate(locale, 'info.check')}</span>
								<span>{spell.check.map(e => attributes.get(e)!.short).join('/')}{spell.checkmod && ` (+${derivedCharacteristics.get(spell.checkmod)!.short})`}</span>
							</p>
							{spell.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${spell.effect}`} />}
							<p className="source">
								<span>{sortStrings(spell.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
							</p>
						</div>
					</Scroll>
				</Aside>;
			case 6:
				return <Aside>
					<Scroll>
						<div className="info spell-info">
							<div className="spell-header info-header">
								<p className="title">{spell.name}</p>
							</div>
							<p>
								<span>{_translate(locale, 'info.check')}</span>
								<span>{spell.check.map(e => attributes.get(e)!.short).join('/')}{spell.checkmod && ` (+${derivedCharacteristics.get(spell.checkmod)!.short})`}</span>
							</p>
							{spell.effect && <Markdown source={`**${_translate(locale, 'info.effect')}:** ${spell.effect}`} />}
							<p className="source">
								<span>{sortStrings(spell.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
							</p>
						</div>
					</Scroll>
				</Aside>;
		}
	}

	return (
		<Aside>
			<div className="info-placeholder">
				&#xE88F;
			</div>
		</Aside>
	);
}
