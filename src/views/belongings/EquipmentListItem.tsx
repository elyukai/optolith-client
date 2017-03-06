import * as React from 'react';
import * as EquipmentActions from '../../actions/EquipmentActions';
import IconButton from '../../components/IconButton';
import TooltipToggle from '../../components/TooltipToggle';
import EquipmentStore from '../../stores/EquipmentStore';
import { get } from '../../stores/ListStore';
import createOverlay from '../../utils/createOverlay';
import ItemEditor from './ItemEditor';

interface Props {
	add?: boolean;
	data: ItemInstance;
}

const GROUPS = ['Nahkampfwaffen', 'Fernkampfwaffen', 'Munition', 'Rüstungen', 'Waffenzubehör', 'Kleidung', 'Reisebedarf und Werkzeuge', 'Beleuchtung', 'Verbandzeug und Heilmittel', 'Behältnisse', 'Seile und Ketten', 'Diebeswerkzeug', 'Handwerkszeug', 'Orientierungshilfen', 'Schmuck', 'Edelsteine und Feingestein', 'Schreibwaren', 'Bücher', 'Magische Artefakte', 'Alchimica', 'Gifte', 'Heilkräuter', 'Musikinstrumente', 'Genussmittel und Luxus', 'Tiere', 'Tierbedarf', 'Forbewegungsmittel'];

export default class EquipmentListItem extends React.Component<Props, undefined> {
	edit = () => {
		const item = EquipmentStore.get(this.props.data.id);
		createOverlay(<ItemEditor item={item} />);
	}
	delete = () => EquipmentActions.removeFromList(this.props.data.id);
	add = () => EquipmentActions.addToList(this.props.data);

	render() {

		const { add, data } = this.props;
		const { isTemplateLocked, template, where } = data;
		const item = isTemplateLocked ? { ...EquipmentStore.getTemplate(template), where } : data;
		const { gr, name, amount, price, weight, combatTechnique, damageDiceNumber, damageDiceSides, damageFlat, damageBonus, at, pa, reach, length, reloadTime, range, ammunition, pro, enc, addPenalties } = item;

		const numberValue = amount > 1 ? amount : null;

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
								<td>{['Kurz', 'Mittel', 'Lang'][reach - 1]}</td>
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
						Zus. Abzüge: {addPenalties ? '-1 GS, -1 INI' : '-'}
					</p> : null}
				</div>
			} margin={11}>
				{add ? (
					<div className="list-item">
						<div className="name">
							<p className="title">{name}</p>
						</div>
						<div className="hr"></div>
						<div className="btns">
							<IconButton
								icon="&#xE145;"
								onClick={this.add}
								flat
								/>
						</div>
					</div>
				) : (
					<div className="list-item">
						<div className="name">
							<p className="title">{numberValue}{numberValue && 'x '}{name}</p>
						</div>
						<div className="hr"></div>
						<div className="type">{GROUPS[gr - 1]}</div>
						<div className="btns">
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
						</div>
					</div>
				)}
			</TooltipToggle>
		);
	}
}
