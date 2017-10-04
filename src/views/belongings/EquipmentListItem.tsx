import * as React from 'react';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { TooltipToggle } from '../../components/TooltipToggle';
import { AttributeInstance, ItemInstance, UIMessages } from '../../types/data.d';
import { CombatTechnique } from '../../types/view.d';
import { createOverlay } from '../../utils/createOverlay';
import { _localizeNumber, _localizeSize, _localizeWeight, _translate } from '../../utils/I18n';
import { convertPrimaryAttributeToArray } from '../../utils/ItemUtils';
import { sign, signNull } from '../../utils/NumberUtils';
import { ItemEditor } from './ItemEditor';

export interface EquipmentListItemProps {
	add?: boolean;
	attributes: Map<string, AttributeInstance>;
	combatTechniques: CombatTechnique[];
	data: ItemInstance;
	locale: UIMessages;
	templates: ItemInstance[];
	addToList(item: ItemInstance): void;
	deleteItem(id: string): void;
	set(id: string, item: ItemInstance): void;
}

export function EquipmentListItem(props: EquipmentListItemProps) {
	const { add, addToList, attributes, combatTechniques, data, deleteItem, locale, templates } = props;
	const { gr, name, price, weight, combatTechnique, damageDiceNumber, damageDiceSides, damageFlat, damageBonus, at, pa, reach, length, reloadTime, range, ammunition, pro, enc, movMod, iniMod, addPenalties, amount } = data;
	const ammunitionTemplate = typeof ammunition === 'string' && templates.find(e => e.id === ammunition);

	const numberValue = amount > 1 ? amount : undefined;

	const addPenaltiesArr = [];

	if (addPenalties === true) {
		addPenaltiesArr.push(`-${1 + (movMod || 0)} GS`);
	}

	if (addPenalties === true) {
		addPenaltiesArr.push(`-${1 + (iniMod || 0)} INI`);
	}

	const combatTechniqueInstance = combatTechnique && combatTechniques.find(e => e.id === combatTechnique);

	const primaryAttributeIdArray = damageBonus && typeof damageBonus.primary === 'string' && convertPrimaryAttributeToArray(damageBonus.primary) || combatTechniqueInstance && combatTechniqueInstance.primary;

	return (
		<TooltipToggle content={
			<div className="inventory-item">
				<h4><span>{name}</span><span>{numberValue}</span></h4>
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
							<td>{primaryAttributeIdArray && damageBonus && (Array.isArray(damageBonus.threshold) ? primaryAttributeIdArray.map((attr, index) => `${attributes.get(attr)!.short} ${(damageBonus.threshold as number[])[index]}`).join('/') : `${primaryAttributeIdArray.map(attr => attributes.get(attr)!.short).join('/')} ${damageBonus.threshold}`)}</td>
						</tr>
						<tr>
							<td>{_translate(locale, 'equipment.view.list.atpamod')}</td>
							<td>{at && sign(at)}/{pa && sign(pa)}</td>
						</tr>
						<tr>
							<td>{_translate(locale, 'equipment.view.list.reach')}</td>
							<td>{reach && _translate(locale, 'equipment.view.list.reachlabels')[reach - 1]}</td>
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
					</tbody>
				</table> : null}
				{ gr === 4 ? <p className="armor">
					{_translate(locale, 'equipment.view.list.additionalpenalties')}: {addPenaltiesArr.length > 0 ? addPenaltiesArr.join(', ') : '-'}
				</p> : null}
			</div>
		} margin={11}>
			{add ? (
				<ListItem>
					<ListItemName name={name} />
					<ListItemSeparator />
					<ListItemButtons>
						<IconButton
							icon="&#xE145;"
							onClick={() => addToList(data)}
							flat
							/>
					</ListItemButtons>
				</ListItem>
			) : (
				<ListItem>
					<ListItemName name={`${numberValue ? numberValue + 'x ' : ''}${name}`} />
					<ListItemSeparator />
					<ListItemGroup list={_translate(locale, 'equipment.view.groups')} index={gr} />
					<ListItemButtons>
						<IconButton
							icon="&#xE254;"
							onClick={function showItemCreation() {
								createOverlay(
									<ItemEditor {...props} item={data} />
								);
							}}
							flat
							/>
						<IconButton
							icon="&#xE872;"
							onClick={() => deleteItem(data.id)}
							flat
							/>
					</ListItemButtons>
				</ListItem>
			)}
		</TooltipToggle>
	);
}
