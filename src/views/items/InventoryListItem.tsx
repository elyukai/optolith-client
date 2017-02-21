import { get } from '../../stores/ListStore';
import * as InventoryActions from '../../actions/InventoryActions';
import * as React from 'react';
import createOverlay from '../../utils/createOverlay';
import IconButton from '../../components/IconButton';
import InventoryStore from '../../stores/InventoryStore';
import ItemEditor from './ItemEditor';
import TooltipToggle from '../../components/TooltipToggle';

interface Props {
	add?: boolean;
	data: ItemInstance;
}

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Rüstungen', 'Munition', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

export default class InventoryListItem extends React.Component<Props, undefined> {
	edit = () => {
		const item = InventoryStore.get(this.props.data.id);
		createOverlay(<ItemEditor item={item} />);
	}
	delete = () => InventoryActions.removeFromList(this.props.data.id);
	add = () => InventoryActions.addToList(this.props.data);

	render() {

		const { add, data } = this.props;
		const { isTemplateLocked, template, where } = data;
		const item = isTemplateLocked ? { ...InventoryStore.getTemplate(template), where } : data;
		const { gr, name, amount, price, weight, combatTechnique, damageDiceNumber, damageDiceSides, damageFlat, damageBonus, at, pa, reach, length, reloadTime, range, ammunition, pro, enc, addPenalties } = item;

		const numberValue = amount > 1 ? amount : null;

		return (
			<TooltipToggle content={
				<div className="inventory-item">
					<h4><span>{name}</span><span>{numberValue}</span></h4>
					{ gr === 3 ? <p className="ammunition">Munition</p> : null}
					{ [4,5].includes(gr) ? <table className="melee">
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
								<td>{get(combatTechnique).name}</td>
							</tr>
							<tr>
								<td>TP</td>
								<td>{damageDiceNumber}W{damageDiceSides}{damageFlat > 0 ? '+' : null}{damageFlat !== 0 ? damageFlat : null}</td>
							</tr>
							<tr>
								<td>L+S</td>
								<td>{(get(combatTechnique) as CombatTechniqueInstance).primary.map(attr => (get(attr) as AttributeInstance).short).join('/')} {damageBonus}</td>
							</tr>
							<tr>
								<td>AT/PA-Mod</td>
								<td>{at > 0 ? '+' : null}{at}/{pa > 0 ? '+' : null}{pa}</td>
							</tr>
							<tr>
								<td>RW</td>
								<td>{['Kurz','Mittel','Lang'][reach - 1]}</td>
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
								<td>{get(combatTechnique).name}</td>
							</tr>
							<tr>
								<td>TP</td>
								<td>{damageDiceNumber}W{damageDiceSides}{damageFlat > 0 ? '+' : null}{damageFlat !== 0 ? damageFlat : null}</td>
							</tr>
							<tr>
								<td>LZ</td>
								<td>{reloadTime}</td>
							</tr>
							<tr>
								<td>RW</td>
								<td>{range.join('/')}</td>
							</tr>
							<tr>
								<td>Munitionstyp</td>
								<td>{(ammunition ? InventoryStore.getTemplate(ammunition) : { name: 'Keine Munition ausgewählt' }).name}</td>
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
						Zus. Abzüge: {addPenalties ? '-1 GS, -1 INI' : '-'}
					</p> : null}
				</div>
			} margin={11}>
				{add ? (
					<tr>
						<td className="name">{name}</td>
						<td className="inc">
							<IconButton
								icon="&#xE145;"
								onClick={this.add}
								/>
						</td>
					</tr>
				):(
					<tr>
						<td className="type">{GROUPS[gr - 1]}</td>
						<td className="number">{numberValue}</td>
						<td className="name">{name}</td>
						<td className="price">{price} S</td>
						<td className="weight">{weight} Stn</td>
						<td className="where">{where}</td>
						<td className="inc">
							<IconButton
								icon="&#xE254;"
								onClick={this.edit}
								/>
							<IconButton
								icon="&#xE872;"
								onClick={this.delete}
								/>
						</td>
					</tr>
				)}
			</TooltipToggle>
		);
	}
}
