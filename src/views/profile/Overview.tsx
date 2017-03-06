import * as React from 'react';
import * as ProfileActions from '../../actions/ProfileActions';
import AvatarWrapper from '../../components/AvatarWrapper';
import BorderButton from '../../components/BorderButton';
import IconButton from '../../components/IconButton';
import Scroll from '../../components/Scroll';
import VerticalList from '../../components/VerticalList';
import * as Categories from '../../constants/Categories';
import * as ActivatableStore from '../../stores/ActivatableStore';
import APStore from '../../stores/APStore';
import CultureStore from '../../stores/CultureStore';
import ELStore from '../../stores/ELStore';
import PhaseStore from '../../stores/PhaseStore';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import ProfileStore from '../../stores/ProfileStore';
import RaceStore from '../../stores/RaceStore';
import calcEL from '../../utils/calcEL';
import createOverlay from '../../utils/createOverlay';
import ActivatableTextList from './ActivatableTextList';
import OverviewAddAP from './OverviewAddAP';
import OverviewAvatarChange from './OverviewAvatarChange';
import OverviewNameChange from './OverviewNameChange';
import OverviewPersonalData from './OverviewPersonalData';

interface State {
	ap: number;
	advActive: ActiveViewObject[];
	disadvActive: ActiveViewObject[];
	phase: number;
	name: string;
	sex: 'm' | 'f';
	avatar: string;
	family: string;
	placeofbirth: string;
	dateofbirth: string;
	age: string;
	haircolor: number;
	eyecolor: number;
	size: string;
	weight: string;
	title: string;
	socialstatus: number;
	characteristics: string;
	otherinfo: string;
	editName: boolean;
}

export default class ProfileOverview extends React.Component<undefined, State> {

	state = {
		...ProfileStore.getAll(),
		advActive: ActivatableStore.getActiveForView(Categories.ADVANTAGES),
		ap: APStore.getTotal(),
		disadvActive: ActivatableStore.getActiveForView(Categories.DISADVANTAGES),
		editName: false,
		phase: PhaseStore.get(),
	};

	_updateAPStore = () => this.setState({ ap: APStore.getTotal() } as State);
	_updateProfileStore = () => this.setState(ProfileStore.getAll() as State);
	_updatePhaseStore = () => this.setState({ phase: PhaseStore.get() } as State);

	componentDidMount() {
		APStore.addChangeListener(this._updateAPStore );
		PhaseStore.addChangeListener(this._updatePhaseStore );
		ProfileStore.addChangeListener(this._updateProfileStore );
	}

	componentWillUnmount() {
		APStore.removeChangeListener(this._updateAPStore );
		PhaseStore.removeChangeListener(this._updatePhaseStore );
		ProfileStore.removeChangeListener(this._updateProfileStore );
	}

	showImageUpload = () => createOverlay(<OverviewAvatarChange />);
	changeName = (name: string) => {
		ProfileActions.setHeroName(name);
		this.setState({ editName: false } as State);
	}
	editName = () => this.setState({ editName: true } as State);
	editNameCancel = () => this.setState({ editName: false } as State);

	endCharacterCreation = () => ProfileActions.endHeroCreation();
	deleteHero = () => ProfileActions.deleteHero();
	addAP = () => createOverlay(<OverviewAddAP />);

	render() {

		const { ap, avatar, editName, name, phase, ...personal } = this.state;

		const sex = this.state.sex === 'm' ? 'Männlich' : 'Weiblich';

		const isProfessionUndefined = ProfessionStore.getCurrentId() === null;

		const currentEL = calcEL(ap);

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
				<Scroll className="text">
					<div className="title-wrapper">
						<AvatarWrapper src={avatar} onClick={this.showImageUpload} />
						<div className="text-wrapper">
							{nameElement}
							{
								isProfessionUndefined ? null : (
									<VerticalList className="rcp">
										<span>{sex}</span>
										<span className="race">
											{(() => {
												const race = RaceStore.getCurrent();
												return race && race.name;
											})()}
										</span>
										<span className="culture">
											{(() => {
												const culture = CultureStore.getCurrent();
												return culture && culture.name;
											})()}
										</span>
										<span className="profession">
											{(() => {
												const profession = ProfessionStore.getCurrent();

												if (profession) {
													let { name, subname } = profession;

													if (typeof name === 'object') {
														name = name[this.state.sex];
													}
													if (typeof subname === 'object') {
														subname = subname[this.state.sex];
													}

													let { name: vname = { m: '', f: '' } } = ProfessionVariantStore.getCurrent() || {};

													if (typeof vname === 'object') {
														vname = vname[this.state.sex];
													}

													return name + (subname ? ` (${subname})` : vname ? ` (${vname})` : '');
												}

												return;
											})()}
										</span>
									</VerticalList>
								)
							}
							<VerticalList className="el">
								<span>
									{(() => {
										const { name } = ELStore.get(currentEL);
										return name;
									})()}
								</span>
								<span>
									{ap} AP
								</span>
							</VerticalList>
						</div>
					</div>
					{
						phase === 3 ? (
							<BorderButton
								className="add-ap"
								label="AP hinzufügen"
								onClick={this.addAP}
								/>
						) : null
					}
					{
						isProfessionUndefined ? null : (
							<h3>Persönliche Daten</h3>
						)
					}
					{
						isProfessionUndefined ? null : (
							<OverviewPersonalData
								{...personal}
								culture={CultureStore.getCurrent()!}
								eyecolorTags={ProfileStore.getEyecolorTags()}
								haircolorTags={ProfileStore.getHaircolorTags()}
								race={RaceStore.getCurrent()!}
								socialstatusTags={ProfileStore.getSocialstatusTags()}
								/>
						)
					}
					{
						phase === 2 ? (
							<div>
								<BorderButton
									className="end-char-creation"
									label="Heldenerstellung beenden"
									onClick={this.endCharacterCreation}
									primary
									/>
							</div>
						) : null
					}
					{
						phase === 3 ? (
							<div>
								<h3>Vorteile</h3>
								<ActivatableTextList list={this.state.advActive} />
								<h3>Nachteile</h3>
								<ActivatableTextList list={this.state.disadvActive} />
								<BorderButton
									className="delete-char"
									label="Held löschen"
									onClick={this.deleteHero}
									disabled
									/>
							</div>
						) : null
					}
				</Scroll>
			</div>
		);
	}
}
