import * as React from 'react';
import { Markdown } from '../../components/Markdown';
import { Scroll } from '../../components/Scroll';
import { AttributeInstance, Book, CombatTechniqueInstance, ItemInstance, UIMessages } from '../../types/data.d';
import { _localizeNumber, _localizeSize, _localizeWeight, _translate } from '../../utils/I18n';
import { convertPrimaryAttributeToArray } from '../../utils/ItemUtils';
import { sign, signNull } from '../../utils/NumberUtils';
import { WikiSource } from './WikiSource';

export interface WikiEquipmentInfoProps {
	attributes: Map<string, AttributeInstance>;
	books: Map<string, Book>;
	combatTechniques: Map<string, CombatTechniqueInstance>;
	currentObject: ItemInstance;
	locale: UIMessages;
	templates: Map<string, ItemInstance>;
}

export function WikiEquipmentInfo(props: WikiEquipmentInfoProps) {
	const { attributes, books, currentObject, locale, combatTechniques, templates } = props;
	const { gr, name, price, weight, combatTechnique, damageDiceNumber, damageDiceSides, damageFlat, damageBonus, at, pa, reach, length, reloadTime, range, ammunition, pro, enc, movMod, iniMod, addPenalties } = currentObject;

	const ammunitionTemplate = typeof ammunition === 'string' && templates.get(ammunition);

	const addPenaltiesArr = [];

	if (addPenalties === true) {
		addPenaltiesArr.push(`-${1 + (movMod || 0)} GS`);
	}

	if (addPenalties === true) {
		addPenaltiesArr.push(`-${1 + (iniMod || 0)} INI`);
	}

	const combatTechniqueInstance = combatTechnique && combatTechniques.get(combatTechnique);

	const primaryAttributeIdArray = damageBonus && typeof damageBonus.primary === 'string' && convertPrimaryAttributeToArray(damageBonus.primary) || combatTechniqueInstance && combatTechniqueInstance.primary;

	return <Scroll>
		<div className="info item-info">
			<div className="item-header info-header">
				<p className="title">{name}</p>
				{gr === 3 && <p className="title">{_translate(locale, 'equipment.view.list.ammunitionsubtitle')}</p>}
			</div>
			{gr === 3 && <p className="ammunition">{_translate(locale, 'equipment.view.list.ammunitionsubtitle')}</p>}
			{ ![1, 2, 4].includes(gr) && <table className="melee">
				<tbody>
					{typeof weight === 'number' && weight > 0 && <tr>
						<td>{_translate(locale, 'equipment.view.list.weight')}</td>
						<td>{`${_localizeNumber(_localizeWeight(weight, locale.id), locale.id)} ${_translate(locale, 'equipment.view.list.weightunit')}`}</td>
					</tr>}
					{typeof price === 'number' && price > 0 && <tr>
						<td>{_translate(locale, 'equipment.view.list.price')}</td>
						<td>{`${_localizeNumber(price, locale.id)} ${_translate(locale, 'equipment.view.list.priceunit')}`}</td>
					</tr>}
				</tbody>
			</table>}
			{ gr === 1 ? <table className="melee">
				<tbody>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.combattechnique')}</td>
						<td>
							{combatTechniqueInstance && combatTechniqueInstance.name}
						</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.damage')}</td>
						<td>{damageDiceNumber}{_translate(locale, 'equipment.view.list.dice')}{damageDiceSides}{damageFlat && signNull(damageFlat)}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.primaryattributedamagethreshold')}</td>
						<td>{combatTechnique === 'CT_7' && '-' || primaryAttributeIdArray && damageBonus && (Array.isArray(damageBonus.threshold) ? primaryAttributeIdArray.map((attr, index) => `${attributes.get(attr)!.short} ${(damageBonus.threshold as number[])[index]}`).join('/') : `${primaryAttributeIdArray.map(attr => attributes.get(attr)!.short).join('/')} ${damageBonus.threshold}`)}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.atpamod')}</td>
						<td>{combatTechnique === 'CT_7' ? '-' : `${at && sign(at)}/${pa && sign(pa)}`}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.reach')}</td>
						<td>{combatTechnique === 'CT_7' && '-' || reach && _translate(locale, 'equipment.view.list.reachlabels')[reach - 1]}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.weight')}</td>
						<td>{weight && `${_localizeNumber(_localizeWeight(weight, locale.id), locale.id)} ${_translate(locale, 'equipment.view.list.weightunit')}`}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.length')}</td>
						<td>{_localizeNumber(_localizeSize(length, locale.id), locale.id)} {_translate(locale, 'equipment.view.list.lengthunit')}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.price')}</td>
						<td>{price && `${_localizeNumber(price, locale.id)} ${_translate(locale, 'equipment.view.list.priceunit')}`}</td>
					</tr>
				</tbody>
			</table> : null}
			{ gr === 2 ? <table className="ranged">
				<tbody>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.combattechnique')}</td>
						<td>
							{combatTechniqueInstance && combatTechniqueInstance.name}
						</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.damage')}</td>
						<td>{damageDiceNumber}{_translate(locale, 'equipment.view.list.dice')}{damageDiceSides}{damageFlat && signNull(damageFlat)}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.reloadtime')}</td>
						<td>{reloadTime} {_translate(locale, 'equipment.view.list.reloadtimeunit')}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.range')}</td>
						<td>{range && range.join('/')}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.ammunition')}</td>
						<td>{(ammunitionTemplate || { name: _translate(locale, 'options.none')} ).name}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.weight')}</td>
						<td>{weight && `${_localizeNumber(_localizeWeight(weight, locale.id), locale.id)} ${_translate(locale, 'equipment.view.list.weightunit')}`}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.length')}</td>
						<td>{_localizeNumber(_localizeSize(length, locale.id), locale.id)} {_translate(locale, 'equipment.view.list.lengthunit')}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.price')}</td>
						<td>{price && `${_localizeNumber(price, locale.id)} ${_translate(locale, 'equipment.view.list.priceunit')}`}</td>
					</tr>
				</tbody>
			</table> : null}
			{ gr === 4 ? <table className="armor">
				<tbody>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.pro')}</td>
						<td>{pro}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.enc')}</td>
						<td>{enc}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.weight')}</td>
						<td>{weight && `${_localizeNumber(_localizeWeight(weight, locale.id), locale.id)} ${_translate(locale, 'equipment.view.list.weightunit')}`}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.price')}</td>
						<td>{price && `${_localizeNumber(price, locale.id)} ${_translate(locale, 'equipment.view.list.priceunit')}`}</td>
					</tr>
					<tr>
						<td>{_translate(locale, 'equipment.view.list.additionalpenalties')}</td>
						<td>{addPenaltiesArr.length > 0 ? addPenaltiesArr.join(', ') : '-'}</td>
					</tr>
				</tbody>
			</table> : null}
			{currentObject.note && <Markdown source={`**${_translate(locale, 'info.note')}:** ${currentObject.note}`} />}
			{currentObject.rules && <Markdown source={`**${_translate(locale, 'info.equipment.rules')}:** ${currentObject.rules}`} />}
			{currentObject.isTemplateLocked && [1, 2, 4].includes(currentObject.gr) && <Markdown source={`**${[1, 2].includes(currentObject.gr) ? _translate(locale, 'info.weaponadvantage') : _translate(locale, 'info.armoradvantage')}:** ${currentObject.advantage || _translate(locale, 'info.none')}`} />}
			{currentObject.isTemplateLocked && [1, 2, 4].includes(currentObject.gr) && <Markdown source={`**${[1, 2].includes(currentObject.gr) ? _translate(locale, 'info.weapondisadvantage') : _translate(locale, 'info.armordisadvantage')}:** ${currentObject.disadvantage || _translate(locale, 'info.none')}`} />}
			{currentObject.src && <WikiSource src={currentObject.src} books={books} locale={locale} />}
		</div>
	</Scroll>;
}
