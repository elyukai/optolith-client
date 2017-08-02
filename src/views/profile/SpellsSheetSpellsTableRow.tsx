import * as classNames from 'classnames';
import * as React from 'react';
import { SecondaryAttribute } from '../../types/data.d';
import { Attribute, Spell, UIMessages } from '../../types/view.d';
import { sortStrings } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { getICName } from '../../utils/ICUtils';

interface SpellsSheetSpellsTableRowProps {
	attributes: Attribute[];
	checkAttributeValueVisibility: boolean;
	derivedCharacteristics: SecondaryAttribute[];
	locale: UIMessages;
	spell: Spell | undefined;
}

export function SpellsSheetSpellsTableRow(props: SpellsSheetSpellsTableRowProps) {
	const { attributes, checkAttributeValueVisibility, derivedCharacteristics, locale, spell } = props;
	if (spell) {
		const { checkmod, ic, property, value } = spell;
		const check = spell.check.map(attr => {
			const attribute = attributes.find(e => e.id === attr)!;
			if (checkAttributeValueVisibility === true) {
				return attribute.value;
			}
			else {
				return attribute.short;
			}
		}).join('/');
		let name = spell.name;
		if (spell.traditions) {
			const traditionNames = _translate(locale, 'spells.view.traditions');
			name += ` (${sortStrings(spell.traditions.map(e => traditionNames[e - 1]), locale.id).join(', ')})`;
		}
		const propertyNames = _translate(locale, 'spells.view.properties');
		return (
			<tr>
				<td className="name">{name}</td>
				<td className={classNames('check', checkmod && 'mod')}>{check}{checkmod && ` (+${derivedCharacteristics.find(e => e.id === checkmod)!.short})`}</td>
				<td className="value">{value}</td>
				<td className="cost"></td>
				<td className="cast-time"></td>
				<td className="range"></td>
				<td className="duration"></td>
				<td className="property">{propertyNames[property - 1]}</td>
				<td className="ic">{getICName(ic)}</td>
				<td className="effect"></td>
				<td className="ref"></td>
			</tr>
		);
	}
	else {
		return (
			<tr>
				<td className="name"></td>
				<td className="check"></td>
				<td className="value"></td>
				<td className="cost"></td>
				<td className="cast-time"></td>
				<td className="range"></td>
				<td className="duration"></td>
				<td className="property"></td>
				<td className="ic"></td>
				<td className="effect"></td>
				<td className="ref"></td>
			</tr>
		);
	}
}
