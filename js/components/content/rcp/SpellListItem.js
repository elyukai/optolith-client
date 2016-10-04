import BorderButton from '../../layout/BorderButton';
import Dropdown from '../../layout/Dropdown';
import RadioButtonGroup from '../../layout/RadioButtonGroup';
import React, { PropTypes, Component } from 'react';
import Scroll from '../../layout/Scroll';
import Slidein from '../../layout/Slidein';
import SpellsActions from '../../../actions/SpellsActions';
import TextField from '../../layout/TextField';
import classNames from 'classnames';

class SpellListItem extends Component {

	static propTypes = {
		spell: PropTypes.object
	};

	constructor(props) {
		super(props);
	}

	addToList = id => SpellsActions.addToList(id);
	addPoint = id => SpellsActions.addPoint(id);
	removePoint = (id, fw) => {
		if (fw === 0) {
			SpellsActions.removeFromList(id);
		} else {
			SpellsActions.removePoint(id);
		}
	};

	render() {

		const spell = this.props.spell;

		const check = spell.check.splice(0, 3);
		const checkmod = spell.check[0];

		const GR = ['Spruch', 'Ritual', 'Fluch', 'Lied', 'Trick'];
		const MERK = ['Antimagie', 'Dämonisch', 'Einfluss', 'Elementar', 'Heilung', 'Hellsicht', 'Illusion', 'Sphären', 'Objekt', 'Telekinese', 'Verwandlung', 'Rituale'];

		return (
			<SkillListItem
				group={GR[spell.gr - 1]}
				name={name}
				fw={spell.fw}
				check={check}
				checkmod={checkmod}
				skt={spell.skt}
				isNotActive={!spell.active}
				activate={}
				addPoint={this.addPoint.bind(null, spell.id)}
				addDisabled={spell.disabledIncrease}
				removePoint={this.removePoint.bind(null, spell.id, spell.fw)}
				removeDisabled={spell.disabledDecrease}>
				<td className="merk">{MERK[spell.merk - 1]}</td>
			</SkillListItem>
		);
	}
}

export default SpellListItem;
