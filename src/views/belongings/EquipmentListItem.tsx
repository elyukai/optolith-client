import * as React from 'react';
import * as EquipmentActions from '../../actions/EquipmentActions';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemGroup } from '../../components/ListItemGroup';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { TooltipToggle } from '../../components/TooltipToggle';
import { EquipmentStore } from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import { AttributeInstance, CombatTechniqueInstance, ItemInstance } from '../../types/data.d';
import { createOverlay } from '../../utils/createOverlay';
import { localizeNumber, localizeSize, localizeWeight, translate } from '../../utils/I18n';
import { ItemEditor } from './ItemEditor';

interface Props {
	add?: boolean;
	data: ItemInstance;
}

export class EquipmentListItem extends React.Component<Props, undefined> {
	edit = () => {
		const item = EquipmentStore.get(this.props.data.id);
		createOverlay(<ItemEditor item={item} />);
	}
	delete = () => EquipmentActions.removeFromList(this.props.data.id);
	add = () => EquipmentActions.addToList(this.props.data);

	render() {

		const { add, data } = this.props;
		const { isTemplateLocked, template, where } = data;
		const item = isTemplateLocked ? { ...EquipmentStore.getTemplate(template!), where } : data;
		const { gr, name, amount, price, weight, combatTechnique, damageDiceNumber, damageDiceSides, damageFlat, damageBonus, at, pa, reach, length, reloadTime, range, ammunition, pro, enc, movMod, iniMod, addPenalties } = item;

		const numberValue = amount > 1 ? amount : null;

		const addPenaltiesArr = [];

		if (addPenalties === true) {
			addPenaltiesArr.push(`-${1 + (movMod || 0)} GS`);
		}

		if (addPenalties === true) {
			addPenaltiesArr.push(`-${1 + (iniMod || 0)} INI`);
		}

		return (
			<TooltipToggle content={
				<div className="inventory-item">
					<h4><span>{name}</span><span>{numberValue}</span></h4>
					{gr === 3 && <p className="ammunition">{translate('equipment.view.list.ammunitionsubtitle')}</p>}
					{ ![1, 2, 4].includes(gr) && <table className="melee">
						<tbody>
							<tr>
								<td>{translate('equipment.view.list.weight')}</td>
								<td>{localizeNumber(localizeWeight(weight))} {translate('equipment.view.list.weightunit')}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.price')}</td>
								<td>{localizeNumber(price)} {translate('equipment.view.list.priceunit')}</td>
							</tr>
						</tbody>
					</table>}
					{ gr === 1 ? <table className="melee">
						<tbody>
							<tr>
								<td>{translate('equipment.view.list.combattechnique')}</td>
								<td>{combatTechnique && get(combatTechnique).name}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.damage')}</td>
								<td>{damageDiceNumber}{translate('equipment.view.list.dice')}{damageDiceSides}{damageFlat && damageFlat > 0 && '+'}{damageFlat !== 0 && damageFlat}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.primaryattributedamagethreshold')}</td>
								<td>{combatTechnique && (get(combatTechnique) as CombatTechniqueInstance).primary.map(attr => (get(attr) as AttributeInstance).short).join('/')} {damageBonus}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.atpamod')}</td>
								<td>{at && at > 0 ? '+' : null}{at}/{pa && pa > 0 ? '+' : null}{pa}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.reach')}</td>
								<td>{reach && translate('equipment.view.list.reachlabels')[reach - 1]}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.weight')}</td>
								<td>{localizeNumber(localizeWeight(weight))} {translate('equipment.view.list.weightunit')}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.length')}</td>
								<td>{localizeNumber(localizeSize(length))} {translate('equipment.view.list.lengthunit')}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.price')}</td>
								<td>{localizeNumber(price)} {translate('equipment.view.list.priceunit')}</td>
							</tr>
						</tbody>
					</table> : null}
					{ gr === 2 ? <table className="ranged">
						<tbody>
							<tr>
								<td>{translate('equipment.view.list.combattechnique')}</td>
								<td>{combatTechnique && get(combatTechnique).name}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.damage')}</td>
								<td>{damageDiceNumber}{translate('equipment.view.list.dice')}{damageDiceSides}{damageFlat && damageFlat > 0 && '+'}{damageFlat !== 0 && damageFlat}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.reloadtime')}</td>
								<td>{reloadTime} {translate('equipment.view.list.reloadtimeunit')}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.range')}</td>
								<td>{range && range.join('/')}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.ammunition')}</td>
								<td>{(ammunition ? EquipmentStore.getTemplate(ammunition) : { name: translate('options.none')} ).name}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.weight')}</td>
								<td>{localizeNumber(localizeWeight(weight))} {translate('equipment.view.list.weightunit')}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.length')}</td>
								<td>{localizeNumber(localizeSize(length))} {translate('equipment.view.list.lengthunit')}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.price')}</td>
								<td>{localizeNumber(price)} {translate('equipment.view.list.priceunit')}</td>
							</tr>
						</tbody>
					</table> : null}
					{ gr === 4 ? <table className="armor">
						<tbody>
							<tr>
								<td>{translate('equipment.view.list.pro')}</td>
								<td>{pro}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.enc')}</td>
								<td>{enc}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.weight')}</td>
								<td>{localizeNumber(localizeWeight(weight))} {translate('equipment.view.list.weightunit')}</td>
							</tr>
							<tr>
								<td>{translate('equipment.view.list.price')}</td>
								<td>{localizeNumber(price)} {translate('equipment.view.list.priceunit')}</td>
							</tr>
						</tbody>
					</table> : null}
					{ gr === 4 ? <p className="armor">
						{translate('equipment.view.list.additionalpenalties')}: {addPenaltiesArr.length > 0 ? addPenaltiesArr.join(', ') : '-'}
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
								onClick={this.add}
								flat
								/>
						</ListItemButtons>
					</ListItem>
				) : (
					<ListItem>
						<ListItemName name={`${numberValue ? numberValue + 'x ' : ''}${name}`} />
						<ListItemSeparator />
						<ListItemGroup list={translate('equipment.view.groups')} index={gr} />
						<ListItemButtons>
							<IconButton
								icon="&#xE254;"
								onClick={this.edit}
								flat
								/>
							<IconButton
								icon="&#xE872;"
								onClick={this.delete}
								flat
								/>
						</ListItemButtons>
					</ListItem>
				)}
			</TooltipToggle>
		);
	}
}
