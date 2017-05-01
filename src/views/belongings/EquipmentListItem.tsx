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
import { ItemEditor } from './ItemEditor';

interface Props {
	add?: boolean;
	data: ItemInstance;
}

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Munition', 'Rüstungen', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

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

		if (typeof movMod === 'number' && addPenalties === true) {
			addPenaltiesArr.push(`-${1 + movMod} GS`);
		}

		if (typeof iniMod === 'number' && addPenalties === true) {
			addPenaltiesArr.push(`-${1 + iniMod} INI`);
		}

		return (
			<TooltipToggle content={
				<div className="inventory-item">
					<h4><span>{name}</span><span>{numberValue}</span></h4>
					{ gr === 3 ? <p className="ammunition">Munition</p> : null}
					{ ![1, 2, 4].includes(gr) ? <table className="melee">
						<tbody>
							<tr>
								<td>Gewicht</td>
								<td>{weight} Stn</td>
							</tr>
							<tr>
								<td>Preis</td>
								<td>{price} S</td>
							</tr>
						</tbody>
					</table> : null}
					{ gr === 1 ? <table className="melee">
						<tbody>
							<tr>
								<td>Kampftechnik</td>
								<td>{combatTechnique && get(combatTechnique).name}</td>
							</tr>
							<tr>
								<td>TP</td>
								<td>{damageDiceNumber}W{damageDiceSides}{damageFlat && damageFlat > 0 ? '+' : null}{damageFlat !== 0 ? damageFlat : null}</td>
							</tr>
							<tr>
								<td>L+S</td>
								<td>{combatTechnique && (get(combatTechnique) as CombatTechniqueInstance).primary.map(attr => (get(attr) as AttributeInstance).short).join('/')} {damageBonus}</td>
							</tr>
							<tr>
								<td>AT/PA-Mod</td>
								<td>{at && at > 0 ? '+' : null}{at}/{pa && pa > 0 ? '+' : null}{pa}</td>
							</tr>
							<tr>
								<td>RW</td>
								<td>{reach && ['Kurz', 'Mittel', 'Lang'][reach - 1]}</td>
							</tr>
							<tr>
								<td>Gewicht</td>
								<td>{weight} Stn</td>
							</tr>
							<tr>
								<td>Länge</td>
								<td>{length} HF</td>
							</tr>
							<tr>
								<td>Preis</td>
								<td>{price} S</td>
							</tr>
						</tbody>
					</table> : null}
					{ gr === 2 ? <table className="ranged">
						<tbody>
							<tr>
								<td>Kampftechnik</td>
								<td>{combatTechnique && get(combatTechnique).name}</td>
							</tr>
							<tr>
								<td>TP</td>
								<td>{damageDiceNumber}W{damageDiceSides}{damageFlat && damageFlat > 0 ? '+' : null}{damageFlat !== 0 ? damageFlat : null}</td>
							</tr>
							<tr>
								<td>LZ</td>
								<td>{reloadTime}</td>
							</tr>
							<tr>
								<td>RW</td>
								<td>{range && range.join('/')}</td>
							</tr>
							<tr>
								<td>Munitionstyp</td>
								<td>{(ammunition ? EquipmentStore.getTemplate(ammunition) : { name: 'Keine' }).name}</td>
							</tr>
							<tr>
								<td>Gewicht</td>
								<td>{weight} Stn</td>
							</tr>
							<tr>
								<td>Länge</td>
								<td>{length} HF</td>
							</tr>
							<tr>
								<td>Preis</td>
								<td>{price} S</td>
							</tr>
						</tbody>
					</table> : null}
					{ gr === 4 ? <table className="armor">
						<tbody>
							<tr>
								<td>RS</td>
								<td>{pro}</td>
							</tr>
							<tr>
								<td>BE</td>
								<td>{enc}</td>
							</tr>
							<tr>
								<td>Gewicht</td>
								<td>{weight} Stn</td>
							</tr>
							<tr>
								<td>Preis</td>
								<td>{price} S</td>
							</tr>
						</tbody>
					</table> : null}
					{ gr === 4 ? <p className="armor">
						Zus. Abzüge: {addPenaltiesArr.length > 0 ? addPenaltiesArr.join(', ') : '-'}
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
						<ListItemGroup list={GROUPS} index={gr} />
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
