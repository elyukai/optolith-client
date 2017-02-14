import { get } from '../../stores/ListStore';
import { Item } from '../../utils/DataUtils';
import createOverlay from '../../utils/createOverlay';
import IconButton from '../../components/IconButton';
import InventoryActions from '../../actions/InventoryActions';
import InventoryStore from '../../stores/InventoryStore';
import ItemEditor from './ItemEditor';
import React, { Component, PropTypes } from 'react';
import TooltipToggle from '../../components/TooltipToggle';

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Rüstungen', 'Munition', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

export default class InventoryListItem extends Component {

	static propTypes = {
		add: PropTypes.bool,
		data: PropTypes.instanceOf(Item).isRequired,
	};

	edit = () => {
		const item = Item.prepareDataForEditor(InventoryStore.get(this.props.data.id));
		createOverlay(<ItemEditor item={item} />);
	}
	delete = () => InventoryActions.removeFromList(this.props.data.id);
	add = () => InventoryActions.addToList(this.props.data);

	render() {

		const { add, data: { gr, name, number, price, weight, where, combattechnique, damageDiceNumber, damageDiceSides, damageFlat, damageBonus, at, pa, reach, length, reloadtime, range, ammunition, pro, enc, addpenalties } } = this.props;

		const numberValue = number > 1 ? number : null;

		return (
			<TooltipToggle content={
				<div className="inventory-item">
					<h4><span>{name}</span><span>{numberValue}</span></h4>
					{ gr === 4 ? <p className="ammunition">Munition</p> : null}
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
								<td>{get(combattechnique).name}</td>
							</tr>
							<tr>
								<td>TP</td>
								<td>{damageDiceNumber}W{damageDiceSides}{damageFlat > 0 ? '+' : null}{damageFlat !== 0 ? damageFlat : null}</td>
							</tr>
							<tr>
								<td>L+S</td>
								<td>{get(combattechnique).primary.map(attr => get(attr).short).join('/')} {damageBonus}</td>
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
								<td>{get(combattechnique).name}</td>
							</tr>
							<tr>
								<td>TP</td>
								<td>{damageDiceNumber}W{damageDiceSides}{damageFlat > 0 ? '+' : null}{damageFlat !== 0 ? damageFlat : null}</td>
							</tr>
							<tr>
								<td>LZ</td>
								<td>{reloadtime}</td>
							</tr>
							<tr>
								<td>RW</td>
								<td>{range.join('/')}</td>
							</tr>
							<tr>
								<td>Munitionstyp</td>
								<td>{(InventoryStore.getTemplate(ammunition) || {}).name}</td>
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
					{ gr === 3 ? <table className="armor">
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
					{ gr === 3 ? <p className="armor">
						Zus. Abzüge: {addpenalties ? '-1 GS, -1 INI' : '-'}
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
