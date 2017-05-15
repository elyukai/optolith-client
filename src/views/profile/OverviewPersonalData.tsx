import * as React from 'react';
import * as ProfileActions from '../../actions/ProfileActions';
import { Dropdown } from '../../components/Dropdown';
import { IconButton } from '../../components/IconButton';
import { InputButtonGroup } from '../../components/InputButtonGroup';
import { TextField } from '../../components/TextField';
import { CultureInstance, InputTextEvent, RaceInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';
import { sort } from '../../utils/ListUtils';

interface Props {
	age?: string;
	characteristics?: string;
	culture: CultureInstance;
	cultureAreaKnowledge?: string;
	dateofbirth?: string;
	eyecolor?: number;
	eyecolorTags: string[];
	family?: string;
	haircolor?: number;
	haircolorTags: string[];
	otherinfo?: string;
	placeofbirth?: string;
	race: RaceInstance;
	size?: string;
	socialstatus?: number;
	socialstatusTags: string[];
	title?: string;
	weight?: string;
}

export class OverviewPersonalData extends React.Component<Props, undefined> {
	changeFamily = (e: InputTextEvent) => ProfileActions.setFamily(e.target.value as string);
	changePlaceOfBirth = (e: InputTextEvent) => ProfileActions.setPlaceOfBirth(e.target.value as string);
	changeDateOfBirth = (e: InputTextEvent) => ProfileActions.setDateOfBirth(e.target.value as string);
	changeAge = (e: InputTextEvent) => ProfileActions.setAge(e.target.value as string);
	changeHaircolor = (result: number) => ProfileActions.setHairColor(result);
	changeEyecolor = (result: number) => ProfileActions.setEyeColor(result);
	changeSize = (e: InputTextEvent) => ProfileActions.setSize(e.target.value as string);
	changeWeight = (e: InputTextEvent) => ProfileActions.setWeight(e.target.value as string);
	changeTitle = (e: InputTextEvent) => ProfileActions.setTitle(e.target.value as string);
	changeSocialStatus = (result: number) => ProfileActions.setSocialStatus(result);
	changeCharacteristics = (e: InputTextEvent) => ProfileActions.setCharacteristics(e.target.value as string);
	changeOtherInfo = (e: InputTextEvent) => ProfileActions.setOtherInfo(e.target.value as string);
	changeCultureAreaKnowledge = (e: InputTextEvent) => ProfileActions.setCultureAreaKnowledge(e.target.value as string);

	rerollHair = () => ProfileActions.rerollHairColor();
	rerollEyes = () => ProfileActions.rerollEyeColor();
	rerollSize = () => ProfileActions.rerollSize();
	rerollWeight = () => ProfileActions.rerollWeight();

	render() {
		const {
			age = '',
			characteristics = '',
			culture,
			cultureAreaKnowledge,
			eyecolor,
			eyecolorTags,
			dateofbirth = '',
			family = '',
			haircolor,
			haircolorTags,
			otherinfo = '',
			placeofbirth = '',
			race,
			size = '',
			socialstatus,
			socialstatusTags,
			title = '',
			weight = ''
		} = this.props;

		const hairArr = race ? sort(haircolorTags.map((name, i) => ({ id: i + 1, name })).filter(e => race.hairColors.includes(e.id))) : [];
		const eyesArr = race ? sort(eyecolorTags.map((name, i) => ({ id: i + 1, name })).filter(e => race.eyeColors.includes(e.id))) : [];
		const socialArr = culture ? socialstatusTags.map((name, i) => ({ id: i + 1, name })).filter(e => culture.socialTiers.includes(e.id)) : [];

		return (
			<div className="personal-data">
				<div>
					<TextField
						label={translate('personaldata.family')}
						value={family}
						onChange={this.changeFamily}
						/>
				</div>
				<div>
					<TextField
						label={translate('personaldata.placeofbirth')}
						value={placeofbirth}
						onChange={this.changePlaceOfBirth}
						/>
				</div>
				<div>
					<TextField
						label={translate('personaldata.dateofbirth')}
						value={dateofbirth}
						onChange={this.changeDateOfBirth}
						/>
				</div>
				<div>
					<TextField
						label={translate('personaldata.age')}
						value={age}
						onChange={this.changeAge}
						/>
				</div>
				<InputButtonGroup className="reroll">
					<Dropdown
						label={translate('personaldata.haircolor')}
						value={haircolor}
						onChange={this.changeHaircolor}
						options={hairArr}
						/>
					<IconButton icon="&#xEB40;" onClick={this.rerollHair} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<Dropdown
						label={translate('personaldata.eyecolor')}
						value={eyecolor}
						onChange={this.changeEyecolor}
						options={eyesArr}
						/>
					<IconButton icon="&#xEB40;" onClick={this.rerollEyes} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<TextField
						label={translate('personaldata.size')}
						value={size}
						onChange={this.changeSize}
						/>
					<IconButton icon="&#xEB40;" onClick={this.rerollSize} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<TextField
						label={translate('personaldata.weight')}
						value={weight}
						onChange={this.changeWeight}
						/>
					<IconButton icon="&#xEB40;" onClick={this.rerollWeight} />
				</InputButtonGroup>
				<div>
					<TextField
						label={translate('personaldata.title')}
						value={title}
						onChange={this.changeTitle}
						/>
				</div>
				<div>
					<Dropdown
						label={translate('personaldata.socialstatus')}
						value={socialstatus}
						onChange={this.changeSocialStatus}
						options={socialArr}
						/>
				</div>
				<div>
					<TextField
						label={translate('personaldata.characteristics')}
						value={characteristics}
						onChange={this.changeCharacteristics}
						/>
				</div>
				<div>
					<TextField
						label={translate('personaldata.otherinfo')}
						value={otherinfo}
						onChange={this.changeOtherInfo}
						/>
				</div>
				<div>
					<TextField
						label={translate('personaldata.cultureareaknowledge')}
						value={cultureAreaKnowledge}
						onChange={this.changeCultureAreaKnowledge}
						/>
				</div>
			</div>
		);
	}
}
