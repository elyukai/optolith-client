import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, SecondaryAttribute, SpecialAbilityInstance } from '../../types/data.d';
import { UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getRoman } from '../../utils/NumberUtils';

export interface WikiActivatableInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	derivedCharacteristics: Map<string, SecondaryAttribute>;
	currentObject: SpecialAbilityInstance;
	locale: UIMessages;
	specialAbilities: Map<string, SpecialAbilityInstance>;
}

export function WikiActivatableInfo(props: WikiActivatableInfoProps) {
	const { books, currentObject, locale, specialAbilities } = props;
	const { apValue, apValueAppend, cost, tiers } = currentObject;

	let costText = `**${_translate(locale, 'info.apvalue')}:** `;

	if (apValue) {
		costText += apValue;
	}
	else if (Array.isArray(cost)) {
		costText += `${_translate(locale, 'info.tier')} ${cost.map((_, i) => getRoman(i, true)).join('/')}: ${cost.join('/')} ${_translate(locale, 'aptext')}`;
	}
	else {
		costText += `${cost} ${_translate(locale, 'aptext')}`;

		if (typeof tiers === 'number') {
			costText += ` ${_translate(locale, 'info.pertier')}`;
		}
	}
	if (apValueAppend) {
		costText += ` ${apValueAppend}`;
	}

	return <Scroll>
		<div className="info specialability-info">
			<div className="specialability-header info-header">
				<p className="title">{currentObject.name}{typeof tiers === 'number' ? tiers < 2 ? ' I' : ` I-${getRoman(tiers)}` : ''}</p>
				{currentObject.subgr && <p className="title">{_translate(locale, 'info.specialabilities.subgroups')[currentObject.subgr - 1]}</p>}
			</div>
			{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.rules')}:** ${currentObject.rules}`} />}
			{currentObject.extended && <Markdown source={`**${_translate(locale, 'info.extendedcombatspecialabilities')}:** ${sortStrings(currentObject.extended.map(e => !Array.isArray(e) ? specialAbilities.get(e)!.name : '...'), locale.id).join(', ')}`} />}
			{currentObject.penalty && <Markdown source={`**${_translate(locale, 'info.penalty')}:** ${currentObject.penalty}`} />}
			{currentObject.combatTechniques && <Markdown source={`**${_translate(locale, 'info.combattechniques')}:** ${currentObject.combatTechniques}`} />}
			{currentObject.aeCost && <p>
				<span>{_translate(locale, 'info.aecost')}</span>
				<span>{currentObject.aeCost}</span>
			</p>}
			{currentObject.protectiveCircle && <p>
				<span>{_translate(locale, 'info.aecost')}</span>
				<span>{currentObject.protectiveCircle}</span>
			</p>}
			{currentObject.wardingCircle && <p>
				<span>{_translate(locale, 'info.aecost')}</span>
				<span>{currentObject.wardingCircle}</span>
			</p>}
			<Markdown source={costText} />
			<p className="source">
				<span>{sortStrings(currentObject.src.map(e => `${books.get(e.id)!.name} ${e.page}`), locale.id).join(', ')}</span>
			</p>
		</div>
	</Scroll>;
}
