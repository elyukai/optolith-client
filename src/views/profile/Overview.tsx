import * as React from 'react';
import { AvatarChange } from '../../components/AvatarChange';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { BorderButton } from '../../components/BorderButton';
import { EditText } from '../../components/EditText';
import { IconButton } from '../../components/IconButton';
import { Page } from '../../components/Page';
import { Scroll } from '../../components/Scroll';
import { VerticalList } from '../../components/VerticalList';
import { ProfileState } from '../../reducers/profile';
import { ActiveViewObject } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { Culture, ExperienceLevel, Profession, ProfessionVariant, Race, RaceVariant } from '../../types/wiki';
import { _translate } from '../../utils/I18n';
import { ActivatableTextList } from './ActivatableTextList';
import { OverviewAddAP } from './OverviewAddAP';
import { OverviewPersonalData, OverviewPersonalDataDispatchProps } from './OverviewPersonalData';

export interface PersonalDataOwnProps {
	locale: UIMessages;
}

export interface PersonalDataStateProps {
	apLeft: number;
	apTotal: number;
	advantages: ActiveViewObject[];
	culture: Culture | undefined;
	currentEl: ExperienceLevel | undefined;
	disadvantages: ActiveViewObject[];
	phase: number;
	profession: Profession | undefined;
	professionVariant: ProfessionVariant | undefined;
	profile: ProfileState;
	race: Race | undefined;
	raceVariant: RaceVariant | undefined;
	isRemovingEnabled: boolean;
	isEditingHeroAfterCreationPhaseEnabled: boolean;
	isAddAdventurePointsOpen: boolean;
	isEditCharacterAvatarOpen: boolean;
}

export interface PersonalDataDispatchProps extends OverviewPersonalDataDispatchProps {
	setAvatar(path: string): void;
	setHeroName(name: string): void;
	setCustomProfessionName(name: string): void;
	endCharacterCreation(): void;
	addAdventurePoints(ap: number): void;
	openAddAdventurePoints(): void;
	closeAddAdventurePoints(): void;
	openEditCharacterAvatar(): void;
	closeEditCharacterAvatar(): void;
}

export type PersonalDataProps = PersonalDataStateProps & PersonalDataDispatchProps & PersonalDataOwnProps;

export interface PersonalDataState {
	editName: boolean;
	editProfessionName: boolean;
	isAvatarChangeOpened: boolean;
	isAddAPOpened: boolean;
}

export class PersonalData extends React.Component<PersonalDataProps, PersonalDataState> {
	state = {
		editName: false,
		editProfessionName: false,
		isAvatarChangeOpened: false,
		isAddAPOpened: false
	};

	openAvatarChange = () => this.setState(() => ({ isAvatarChangeOpened: true } as PersonalDataState));
	closeAvatarChange = () => this.setState(() => ({ isAvatarChangeOpened: false } as PersonalDataState));
	openAddAP = () => this.setState(() => ({ isAddAPOpened: true } as PersonalDataState));
	closeAddAP = () => this.setState(() => ({ isAddAPOpened: false } as PersonalDataState));
	changeName = (name: string) => {
		this.props.setHeroName(name);
		this.setState({ editName: false } as PersonalDataState);
	}
	changeProfessionName = (name: string) => {
		this.props.setCustomProfessionName(name);
		this.setState({ editProfessionName: false } as PersonalDataState);
	}
	editName = () => this.setState({ editName: true } as PersonalDataState);
	editNameCancel = () => this.setState({ editName: false } as PersonalDataState);
	editProfessionName = () => this.setState({ editProfessionName: true } as PersonalDataState);
	editProfessionNameCancel = () => this.setState({ editProfessionName: false } as PersonalDataState);

	render() {
		const {
			advantages,
			apLeft,
			apTotal,
			culture,
			currentEl,
			disadvantages,
			endCharacterCreation,
			locale,
			phase,
			profession,
			professionVariant,
			profile,
			race,
			raceVariant,
			isEditingHeroAfterCreationPhaseEnabled,
			isAddAdventurePointsOpen,
			isEditCharacterAvatarOpen,
			openAddAdventurePoints,
			openEditCharacterAvatar,
			closeAddAdventurePoints,
			closeEditCharacterAvatar,
			setAvatar,
			...other
		} = this.props;

		const { avatar, name, professionName, sex } = profile;
		const {
			editName,
			editProfessionName
		} = this.state;

		const professionId = profession && profession.id;
		const isOwnProfession = professionId === 'P_0';
		const isProfessionUndefined = professionId === null;

		const nameElement = editName ? (
			<EditText
				className="change-name"
				cancel={this.editNameCancel}
				submit={this.changeName}
				text={name}
				autoFocus
				/>
		) : (
			<h1 className="confirm-edit">
				{name}
				<IconButton icon="&#xE90c;" onClick={this.editName} />
			</h1>
		);

		const professionNameElement = phase > 1 && isOwnProfession && (editProfessionName ? (
			<EditText
				cancel={this.editProfessionNameCancel}
				submit={this.changeProfessionName}
				text={professionName}
				/>
		) : (
			<BorderButton
				className="edit-profession-name-btn"
				label={_translate(locale, 'profileoverview.view.editprofessionname')}
				onClick={this.editProfessionName}
				/>
		));

		return (
			<Page id="personal-data">
				<Scroll className="text">
					<div className="title-wrapper">
						<AvatarWrapper src={avatar} onClick={openEditCharacterAvatar} />
						<div className="text-wrapper">
							{nameElement}
							{
								!isProfessionUndefined && (
									<VerticalList className="rcp">
										<span>{_translate(locale, sex === 'm' ? 'profileoverview.view.male' : 'profileoverview.view.female')}</span>
										<span className="race">
											{(() => {
												return race && race.name;
											})()}
											{(() => {
												return raceVariant ? ` (${raceVariant.name})` : '';
											})()}
										</span>
										<span className="culture">
											{(() => {
												return culture && culture.name;
											})()}
										</span>
										<span className="profession">
											{(() => {
												if (profession && sex) {
													let { name, subname } = profession;

													if (typeof name === 'object') {
														name = name[sex];
													}
													else if (isOwnProfession && professionName) {
														name = professionName;
													}

													if (typeof subname === 'object') {
														subname = subname[sex];
													}

													let vname = professionVariant && professionVariant.name;

													if (typeof vname === 'object') {
														vname = vname[sex];
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
										return currentEl && currentEl.name;
									})()}
								</span>
								<span>
									{apTotal} AP
								</span>
							</VerticalList>
						</div>
					</div>
					<div className="main-profile-actions">
						{
							phase === 3 && (
								<BorderButton
									className="add-ap"
									label={_translate(locale, 'profileoverview.actions.addadventurepoints')}
									onClick={openAddAdventurePoints}
									/>
							)
						}
						{professionNameElement}
					</div>
					{
						!isProfessionUndefined && (
							<h3>{_translate(locale, 'profileoverview.view.personaldata')}</h3>
						)
					}
					{
						!isProfessionUndefined && (
							<OverviewPersonalData
								{...other}
								profile={profile}
								culture={culture}
								eyecolorTags={_translate(locale, 'eyecolors')}
								haircolorTags={_translate(locale, 'haircolors')}
								race={race}
								raceVariant={raceVariant}
								socialstatusTags={_translate(locale, 'socialstatus')}
								locale={locale}
								/>
						)
					}
					{
						phase === 2 && (
							<div>
								<BorderButton
									className="end-char-creation"
									label={_translate(locale, 'profileoverview.actions.endherocreation')}
									onClick={endCharacterCreation}
									primary
									disabled={apLeft < 0 || apLeft > 10 && !isEditingHeroAfterCreationPhaseEnabled}
									/>
							</div>
						)
					}
					{
						phase === 3 && (
							<div>
								<h3>{_translate(locale, 'profileoverview.view.advantages')}</h3>
								<ActivatableTextList list={advantages} locale={locale} />
								<h3>{_translate(locale, 'profileoverview.view.disadvantages')}</h3>
								<ActivatableTextList list={disadvantages} locale={locale} />
							</div>
						)
					}
				</Scroll>
				<OverviewAddAP
					{...this.props}
					close={closeAddAdventurePoints}
					isOpened={isAddAdventurePointsOpen}
					/>
				<AvatarChange
					{...this.props}
					setPath={setAvatar}
					close={closeEditCharacterAvatar}
					isOpened={isEditCharacterAvatarOpen}
					/>
			</Page>
		);
	}
}
