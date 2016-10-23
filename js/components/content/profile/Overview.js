import Avatar from '../../layout/Avatar';
import APStore from '../../../stores/APStore';
import CultureStore from '../../../stores/rcp/CultureStore';
import DisAdvStore from '../../../stores/DisAdvStore';
import Dropdown from '../../layout/Dropdown';
import ELStore from '../../../stores/ELStore';
import IconButton from '../../layout/IconButton';
import OverviewDisAdv from './OverviewDisAdv';
import OverviewNameChange from './OverviewNameChange';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../../../stores/rcp/ProfessionVariantStore';
import RaceStore from '../../../stores/rcp/RaceStore';
import ProfileActions from '../../../actions/ProfileActions';
import ProfileStore from '../../../stores/ProfileStore';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';
import TextField from '../../layout/TextField';

class Overview extends Component {
	
	state = { 
		advActive: DisAdvStore.getActiveForView(true),
		disadvActive: DisAdvStore.getActiveForView(false),
		name: ProfileStore.getName(),
		gender: ProfileStore.getGender(),
		portrait: ProfileStore.getPortrait(),
		hair: ProfileStore.getHair(),
		eyes: ProfileStore.getEyes(),
		size: ProfileStore.getSize(),
		weight: ProfileStore.getWeight(),
		showImageUpload: false,
		editName: false
	};

	constructor(props) {
		super(props);
	}
	
	_updateProfileStore = () => this.setState({
		name: ProfileStore.getName(),
		gender: ProfileStore.getGender(),
		portrait: ProfileStore.getPortrait(),
		hair: ProfileStore.getHair(),
		eyes: ProfileStore.getEyes(),
		size: ProfileStore.getSize(),
		weight: ProfileStore.getWeight()
	});

	showImageUpload = () => ProfileActions.showImageUpload();
	changeName = name => {
		ProfileActions.changeName(name);
		this.setState({ editName: false });
	};
	editName = () => this.setState({ editName: true });
	editNameCancel = () => this.setState({ editName: false });
	changeHair = option => ProfileActions.changeHair(option);
	changeEyes = option => ProfileActions.changeEyes(option);
	changeSize = event => ProfileActions.changeSize(event.target.value);
	changeWeight = event => ProfileActions.changeWeight(event.target.value);
	rerollHair = () => ProfileActions.rerollHair();
	rerollEyes = () => ProfileActions.rerollEyes();
	rerollSize = () => ProfileActions.rerollSize();
	rerollWeight = () => ProfileActions.rerollWeight();
	
	componentDidMount() {
		ProfileStore.addChangeListener(this._updateProfileStore );
	}
	
	componentWillUnmount() {
		ProfileStore.removeChangeListener(this._updateProfileStore );
	}

	render() {

		const { editName, name, portrait, hair, eyes, size, weight } = this.state;

		const hairArr = RaceStore.getCurrent() ? [
			['blauschwarz',1],
			['blond',2],
			['braun',3],
			['dunkelblond',4],
			['dunkelbraun',5],
			['goldblond',6],
			['grau',7],
			['hellblond',8],
			['hellbraun',9],
			['kupferrot',10],
			['mittelblond', 11],
			['mittelbraun', 12],
			['rot', 13],
			['rotblond', 14],
			['schneeweiß', 15],
			['schwarz', 16],
			['silbern', 17],
			['weißblond', 18],
			['dunkelgrau', 19],
			['hellgrau', 20],
			['salzweiß', 21],
			['silberweiß', 22],
			['feuerrot', 23]
		].filter(e =>
			RaceStore.getCurrent().hair.indexOf(e[1]) > -1
		) : [];

		const eyesArr = RaceStore.getCurrent() ? [
			['amethystviolett',1],
			['bernsteinfarben',2],
			['blau',3],
			['braun',4],
			['dunkelbraun',5],
			['dunkelviolett',6],
			['eisgrau',7],
			['goldgesprenkelt',8],
			['grau',9],
			['graublau',10],
			['grün', 11],
			['hellbraun', 12],
			['rubinrot', 13],
			['saphirblau', 14],
			['schwarz', 15],
			['schwarzbraun', 16],
			['silbergrau', 17],
			['smaragdgrün', 18]
		].filter(e =>
			RaceStore.getCurrent().eyes.indexOf(e[1]) > -1
		) : [];

		const gender = this.state.gender === 'm' ? 'Männlich' : 'Weiblich';

		const elAp = [ 900, 1000, 1100, 1200, 1400, 1700, 2100 ], ap = APStore.get();

		var currentEL = 'EL_7';

		for (let i = 0; i < elAp.length; i++) {
			if (elAp[i] >= ap) {
				currentEL = `EL_${i > 0 ? i : 1}`;
				break;
			}
		}

		const nameElement = editName ? (
			<OverviewNameChange
				cancel={this.editNameCancel}
				change={this.changeName}
				name={name} />
		) : (
			<h1>
				{name}
				<IconButton icon="&#xE254;" onClick={this.editName} />
			</h1>
		);

		return (
			<div className="page" id="overview">
				<Scroll>
					<div className="title-wrapper">
						<Avatar src={portrait} onClick={this.showImageUpload} wrapper />
						<div className="text-wrapper">
							{nameElement}
							<div className="rcp">
								{ gender } &middot; {
									RaceStore.getCurrent() !== undefined ? RaceStore.getCurrent().name : null
								} &middot; {
									CultureStore.getCurrent() !== undefined ? CultureStore.getCurrent().name : null
								} &middot; {
									ProfessionStore.getCurrentID() === 'P_0' ? 'Eigene Profession' : ProfessionStore.getCurrent() !== undefined ? (ProfessionVariantStore.getCurrentID() !== null ? `${ProfessionStore.getCurrent().name} (${ProfessionVariantStore.getCurrent().name})`: ProfessionStore.getCurrent().name) : null
								}
							</div>
							<div className="el">
								{ELStore.get(currentEL).name} &middot; {ap} AP
							</div>
						</div>
					</div>
					<h3>Aussehen</h3>
					<h4>Haarfarbe</h4>
					<Dropdown
						value={hair}
						onChange={this.changeHair}
						options={hairArr}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollHair} />
					<h4>Augenfarbe</h4>
					<Dropdown
						value={eyes}
						onChange={this.changeEyes}
						options={eyesArr}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollEyes} />
					<h4>Körpergröße</h4>
					<TextField
						value={size}
						onChange={this.changeSize}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollSize} />
					<h4>Gewicht</h4>
					<TextField
						value={weight}
						onChange={this.changeWeight}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollWeight} />
					<h3>Vorteile</h3>
					<OverviewDisAdv list={this.state.advActive} />
					<h3>Nachteile</h3>
					<OverviewDisAdv list={this.state.disadvActive} />
				</Scroll>
			</div>
		);
	}
}

export default Overview;
