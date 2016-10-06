import BorderButton from '../../layout/BorderButton';
import Dropdown from '../../layout/Dropdown';
import LiturgiesActions from '../../../actions/LiturgiesActions';
import LiturgiesStore from '../../../stores/LiturgiesStore';
import RadioButtonGroup from '../../layout/RadioButtonGroup';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';
import SkillListItem from './SkillListItem';
import Slidein from '../../layout/Slidein';
import TextField from '../../layout/TextField';

class Liturgies extends Component {
	
	state = { 
		liturgiesActive: LiturgiesStore.getActiveForView(),
		liturgiesDeactive: LiturgiesStore.getDeactiveForView(),
		addChantsDisabled: LiturgiesStore.isActivationDisabled(),
		filter: LiturgiesStore.getFilter(),
		sortOrder: LiturgiesStore.getSortOrder(),
		showAddSlidein: false
	};

	constructor(props) {
		super(props);
	}
	
	_updateLiturgiesStore = () => this.setState({ 
		liturgiesActive: LiturgiesStore.getActiveForView(),
		liturgiesDeactive: LiturgiesStore.getDeactiveForView(),
		addChantsDisabled: LiturgiesStore.isActivationDisabled(),
		filter: LiturgiesStore.getFilter(),
		sortOrder: LiturgiesStore.getSortOrder()
	});

	filter = event => LiturgiesActions.filter(event.target.value);
	sort = option => LiturgiesActions.sort(option);
	addToList = id => LiturgiesActions.addToList(id);
	addPoint = id => LiturgiesActions.addPoint(id);
	removePoint = (id, fw) => {
		if (fw === 0) {
			LiturgiesActions.removeFromList(id);
		} else {
			LiturgiesActions.removePoint(id);
		}
	};
	showAddSlidein = () => this.setState({ showAddSlidein: true });
	hideAddSlidein = () => this.setState({ showAddSlidein: false });
	
	componentDidMount() {
		LiturgiesStore.addChangeListener(this._updateLiturgiesStore );
	}
	
	componentWillUnmount() {
		LiturgiesStore.removeChangeListener(this._updateLiturgiesStore );
	}

	render() {

		const GR = ['Liturgie', 'Zeremonie', 'Segnung'];
		const ASPC = ['Allgemein', 'Antimagie', 'Ordnung', 'Schild', 'Sturm', 'Tod', 'Traum', 'Magie', 'Wissen', 'Handel', 'Schatten', 'Heilung', 'Landwirtschaft'];

		return (
			<div className="page" id="liturgies">
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
							}
						]} />
					</div>
					<Scroll className="list">
						<table>
							<thead>
								<tr>
									<td className="type">Gruppe</td>
									<td className="name">Liturgie</td>
									<td className="merk">Aspekte</td>
									<td className="check">Probe</td>
									<td className="skt">Sf.</td>
									<td className="inc"></td>
								</tr>
							</thead>
							<tbody>
								{
									this.state.liturgiesDeactive.map(liturgy => {
										const [ a, b, c, checkmod ] = liturgy.check;
										const check = [ a, b, c ];

										let name = liturgy.name;

										const aspc = liturgy.aspc.map(asp => ASPC[asp - 1]).sort().join(', ');

										const obj = liturgy.gr === 3 ? {} : {
											check,
											checkmod,
											skt: liturgy.skt
										};

										return (
											<SkillListItem
												key={liturgy.id}
												group={GR[liturgy.gr - 1]}
												name={name}
												isNotActive
												activate={this.addToList.bind(null, liturgy.id)}
												activateDisabled={this.state.addChantsDisabled && liturgy.gr < 3}
												{...obj}
												>
												<td className="aspc">{aspc}</td>
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
								<td className="name">Liturgie</td>
								<td className="fw">Fw</td>
								<td className="merk">Aspekte</td>
								<td className="check">Probe</td>
								<td className="skt">Sf.</td>
								<td className="inc"></td>
							</tr>
						</thead>
						<tbody>
							{
								this.state.liturgiesActive.map(liturgy => {
									const [ a1, a2, a3, checkmod ] = liturgy.check;
									const check = [ a1, a2, a3 ];

									let name = liturgy.name;

									const aspc = liturgy.aspc.map(asp => ASPC[asp - 1]).sort().join(', ');

									const obj = liturgy.gr === 3 ? {} : {
										fw: liturgy.fw,
										check,
										checkmod,
										skt: liturgy.skt,
										addPoint: this.addPoint.bind(null, liturgy.id),
										addDisabled: liturgy.disabledIncrease
									};

									return (
										<SkillListItem
											key={liturgy.id}
											group={GR[liturgy.gr - 1]}
											name={name}
											removePoint={this.removePoint.bind(null, liturgy.id)}
											removeDisabled={liturgy.disabledDecrease}
											{...obj} >
											<td className="aspc">{aspc}</td>
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

export default Liturgies;
