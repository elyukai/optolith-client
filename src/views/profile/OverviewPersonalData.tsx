import * as React from 'react';
import * as ProfileActions from '../../actions/ProfileActions';
import { Dropdown } from '../../components/Dropdown';
import { IconButton } from '../../components/IconButton';
import { InputButtonGroup } from '../../components/InputButtonGroup';
import { TextField } from '../../components/TextField';
import { getLocale } from '../../stores/LocaleStore';
import { CultureInstance, InputTextEvent, RaceInstance } from '../../types/data.d';

interface Props {
	age: string;
	characteristics: string;
	culture: CultureInstance;
	cultureAreaKnowledge: string;
	dateofbirth: string;
	eyecolor: number;
	eyecolorTags: string[];
	family: string;
	haircolor: number;
	haircolorTags: string[];
	otherinfo: string;
	placeofbirth: string;
	race: RaceInstance;
	size: number | string;
	socialstatus: number;
	socialstatusTags: string[];
	title: string;
	weight: number | string;
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
		const { age, characteristics, culture, cultureAreaKnowledge, eyecolor, eyecolorTags, dateofbirth, family, haircolor, haircolorTags, otherinfo, placeofbirth, race, size, socialstatus, socialstatusTags, title, weight } = this.props;

		const hairArr = race ? haircolorTags.map((name, i) => ({ id: i + 1, name })).filter(e => race.hairColors.includes(e.id)) : [];
		const eyesArr = race ? eyecolorTags.map((name, i) => ({ id: i + 1, name })).filter(e => race.eyeColors.includes(e.id)) : [];
		const socialArr = culture ? socialstatusTags.map((name, i) => ({ id: i + 1, name })).filter(e => culture.socialTiers.includes(e.id)) : [];

		return (
			<div className="personal-data">
				<div>
					<TextField
						label={getLocale()['personaldata.family']}
						value={family}
						onChange={this.changeFamily}
						/>
				</div>
				<div>
					<TextField
						label={getLocale()['personaldata.placeofbirth']}
						value={placeofbirth}
						onChange={this.changePlaceOfBirth}
						/>
				</div>
				<div>
					<TextField
						label={getLocale()['personaldata.dateofbirth']}
						value={dateofbirth}
						onChange={this.changeDateOfBirth}
						/>
				</div>
				<div>
					<TextField
						label={getLocale()['personaldata.age']}
						value={age}
						onChange={this.changeAge}
						/>
				</div>
				<InputButtonGroup className="reroll">
					<Dropdown
						label={getLocale()['personaldata.haircolor']}
						value={haircolor}
						onChange={this.changeHaircolor}
						options={hairArr}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollHair} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<Dropdown
						label={getLocale()['personaldata.eyecolor']}
						value={eyecolor}
						onChange={this.changeEyecolor}
						options={eyesArr}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollEyes} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<TextField
						label={getLocale()['personaldata.size']}
						value={size}
						onChange={this.changeSize}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollSize} />
				</InputButtonGroup>
				<InputButtonGroup className="reroll">
					<TextField
						label={getLocale()['personaldata.size']}
						value={weight}
						onChange={this.changeWeight}
						/>
					<IconButton icon="&#xE863;" onClick={this.rerollWeight} />
				</InputButtonGroup>
				<div>
					<TextField
						label={getLocale()['personaldata.title']}
						value={title}
						onChange={this.changeTitle}
						/>
				</div>
				<div>
					<Dropdown
						label={getLocale()['personaldata.socialstatus']}
						value={socialstatus}
						onChange={this.changeSocialStatus}
						options={socialArr}
						/>
				</div>
				<div>
					<TextField
						label={getLocale()['personaldata.characteristics']}
						value={characteristics}
						onChange={this.changeCharacteristics}
						/>
				</div>
				<div>
					<TextField
						label={getLocale()['personaldata.otherinfo']}
						value={otherinfo}
						onChange={this.changeOtherInfo}
						/>
				</div>
				<div>
					<TextField
						label={getLocale()['personaldata.cultureareaknowledge']}
						value={cultureAreaKnowledge}
						onChange={this.changeCultureAreaKnowledge}
						/>
				</div>
			</div>
		);
	}
}
