import BorderButton from '../../layout/BorderButton';
import RadioButtonGroup from '../../layout/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';
import SkillListItem from './SkillListItem';
import Slidein from '../../layout/Slidein';
import SpellsActions from '../../../actions/SpellsActions';
import SpellsStore from '../../../stores/SpellsStore';
import TextField from '../../layout/TextField';

class Spells extends Component {
	
	state = { 
		spellsActive: SpellsStore.getActiveForView(),
		spellsDeactive: SpellsStore.getDeactiveForView(),
		addSpellsDisabled: SpellsStore.isActivationDisabled(),
		filter: SpellsStore.getFilter(),
		sortOrder: SpellsStore.getSortOrder(),
		showAddSlidein: false
	};

	constructor(props) {
		super(props);
	}
	
	_updateSpellsStore = () => this.setState({ 
		spellsActive: SpellsStore.getActiveForView(),
		spellsDeactive: SpellsStore.getDeactiveForView(),
		addSpellsDisabled: SpellsStore.isActivationDisabled(),
		filter: SpellsStore.getFilter(),
		sortOrder: SpellsStore.getSortOrder()
	});

	filter = event => SpellsActions.filter(event.target.value);
	sort = option => SpellsActions.sort(option);
	addToList = id => SpellsActions.addToList(id);
	addPoint = id => SpellsActions.addPoint(id);
	removePoint = (id, fw) => {
		if (fw === 0) {
			SpellsActions.removeFromList(id);
		} else {
			SpellsActions.removePoint(id);
		}
	};
	showAddSlidein = () => this.setState({ showAddSlidein: true });
	hideAddSlidein = () => this.setState({ showAddSlidein: false });
	
	componentDidMount() {
		SpellsStore.addChangeListener(this._updateSpellsStore );
	}
	
	componentWillUnmount() {
		SpellsStore.removeChangeListener(this._updateSpellsStore );
	}

	render() {

		const GR = ['Spruch', 'Ritual', 'Fluch', 'Lied', 'Trick'];
		const MERK = ['Antimagie', 'Dämonisch', 'Einfluss', 'Elementar', 'Heilung', 'Hellsicht', 'Illusion', 'Sphären', 'Objekt', 'Telekinese', 'Verwandlung', 'Rituale'];

		return (
			<div className="page" id="spells">
				<Slidein isOpen={this.state.showAddSlidein} close={this.hideAddSlidein}>
					<div className="options">
						<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
						<RadioButtonGroup active={this.state.sortOrder} onClick={this.sort} array={[
							{
								name: 'Alphabetisch',
								value: 'name'
							},
							{
								name: 'Gruppen',
								value: 'groups'
							},
							{
								name: 'Merkmal',
								value: 'merk'
							}
						]} />
					</div>
					<Scroll className="list">
						<table>
							<thead>
								<tr>
									<td className="type">Gruppe</td>
									<td className="name">Zauber</td>
									<td className="merk">Merkmal</td>
									<td className="check">Probe</td>
									<td className="skt">Sf.</td>
									<td className="inc"></td>
								</tr>
							</thead>
							<tbody>
								{
									this.state.spellsDeactive.map(spell => {
										const [ a, b, c, checkmod ] = spell.check;
										const check = [ a, b, c ];

										let name = spell.name;
										if (!spell.ownTradition) name += ` (${spell.add})`;

										const obj = spell.gr === 5 ? {} : {
											check,
											checkmod,
											skt: spell.skt
										};

										return (
											<SkillListItem
												key={spell.id}
												group={GR[spell.gr - 1]}
												name={name}
												isNotActive
												activate={this.addToList.bind(null, spell.id)}
												activateDisabled={this.state.addSpellsDisabled && spell.gr < 3}
												{...obj}
												>
												<td className="merk">{MERK[spell.merk - 1]}</td>
											</SkillListItem>
										);
									})
								}
							</tbody>
						</table>
					</Scroll>
				</Slidein>
				<div className="options">
					<TextField hint="Suchen" value={this.state.filter} onChange={this.filter} fullWidth />
					<RadioButtonGroup active={this.state.sortOrder} onClick={this.sort} array={[
						{
							name: 'Alphabetisch',
							value: 'name'
						},
						{
							name: 'Gruppen',
							value: 'groups'
						},
						{
							name: 'Merkmal',
							value: 'merk'
						}
					]} />
					<BorderButton
						label="Hinzufügen"
						onClick={this.showAddSlidein}
						/>
				</div>
				<Scroll className="list">
					<table>
						<thead>
							<tr>
								<td className="type">Gruppe</td>
								<td className="name">Zauber</td>
								<td className="fw">Fw</td>
								<td className="merk">Merkmal</td>
								<td className="check">Probe</td>
								<td className="skt">Sf.</td>
								<td className="inc"></td>
							</tr>
						</thead>
						<tbody>
							{
								this.state.spellsActive.map(spell => {
									const [ a1, a2, a3, checkmod ] = spell.check;
									const check = [ a1, a2, a3 ];

									let name = spell.name;
									if (!spell.ownTradition) name += ` (${spell.add})`;

									const obj = spell.gr === 5 ? {} : {
										fw: spell.fw,
										check,
										checkmod,
										skt: spell.skt,
										addPoint: this.addPoint.bind(null, spell.id),
										addDisabled: spell.disabledIncrease
									};

									return (
										<SkillListItem
											key={spell.id}
											group={GR[spell.gr - 1]}
											name={name}
											removePoint={this.removePoint.bind(null, spell.id)}
											removeDisabled={spell.disabledDecrease}
											{...obj} >
											<td className="merk">{MERK[spell.merk - 1]}</td>
										</SkillListItem>
									);
								})
							}
						</tbody>
					</table>
				</Scroll>
			</div>
		);
	}
}

export default Spells;
