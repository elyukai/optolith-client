import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { IconButton } from '../../components/IconButton';
import { InputButtonGroup } from '../../components/InputButtonGroup';
import { TextField } from '../../components/TextField';
import { ProfileState } from '../../reducers/profile';
import { InputTextEvent } from '../../types/data.d';
import { UIMessages } from '../../types/ui.d';
import { Culture, Race, RaceVariant } from '../../types/wiki';
import { sortObjects } from '../../utils/FilterSortUtils';
import { _translate } from '../../utils/I18n';
import { isEmptyOr, isFloat, isNaturalNumber } from '../../utils/RegexUtils';

export interface OverviewPersonalDataOwnProps {
	culture: Culture | undefined;
	eyecolorTags: string[];
	haircolorTags: string[];
	locale: UIMessages;
	profile: ProfileState;
	race: Race | undefined;
	raceVariant: RaceVariant | undefined;
	socialstatusTags: string[];
}

export interface OverviewPersonalDataDispatchProps {
	changeFamily(event: InputTextEvent): void;
	changePlaceOfBirth(event: InputTextEvent): void;
	changeDateOfBirth(event: InputTextEvent): void;
	changeAge(event: InputTextEvent): void;
	changeHaircolor(result: number): void;
	changeEyecolor(result: number): void;
	changeSize(event: InputTextEvent): void;
	changeWeight(event: InputTextEvent): void;
	changeTitle(event: InputTextEvent): void;
	changeSocialStatus(result: number): void;
	changeCharacteristics(event: InputTextEvent): void;
	changeOtherInfo(event: InputTextEvent): void;
	changeCultureAreaKnowledge(event: InputTextEvent): void;
	rerollHair(): void;
	rerollEyes(): void;
	rerollSize(): void;
	rerollWeight(): void;
}

export type OverviewPersonalDataProps = OverviewPersonalDataDispatchProps & OverviewPersonalDataOwnProps;

export function OverviewPersonalData(props: OverviewPersonalDataProps) {
	const {
		culture,
		eyecolorTags,
		haircolorTags,
		locale,
		profile: {
			age = '',
			characteristics = '',
			cultureAreaKnowledge,
			eyecolor,
			dateofbirth = '',
			family = '',
			haircolor,
			otherinfo = '',
			placeofbirth = '',
			size = '',
			socialstatus,
			title = '',
			weight = ''
		},
		race,
		raceVariant,
		socialstatusTags
	} = props;

	const hairArr = race ? sortObjects(haircolorTags.map((name, i) => ({ id: i + 1, name })).filter(e => (race.hairColors || raceVariant && raceVariant.hairColors)!.includes(e.id)), locale.id) : [];
	const eyesArr = race ? sortObjects(eyecolorTags.map((name, i) => ({ id: i + 1, name })).filter(e => (race.eyeColors || raceVariant && raceVariant.eyeColors)!.includes(e.id)), locale.id) : [];
	const socialArr = culture ? socialstatusTags.map((name, i) => ({ id: i + 1, name })).filter(e => culture.socialStatus.includes(e.id)) : [];

	return (
		<div className="personal-data">
			<div>
				<TextField
					label={_translate(locale, 'personaldata.family')}
					value={family}
					onChange={props.changeFamily}
					/>
			</div>
			<div>
				<TextField
					label={_translate(locale, 'personaldata.placeofbirth')}
					value={placeofbirth}
					onChange={props.changePlaceOfBirth}
					/>
			</div>
			<div>
				<TextField
					label={_translate(locale, 'personaldata.dateofbirth')}
					value={dateofbirth}
					onChange={props.changeDateOfBirth}
					/>
			</div>
			<div>
				<TextField
					label={_translate(locale, 'personaldata.age')}
					value={age}
					onChange={props.changeAge}
					valid={isEmptyOr(isNaturalNumber, age)}
					/>
			</div>
			<InputButtonGroup className="reroll">
				<Dropdown
					label={_translate(locale, 'personaldata.haircolor')}
					value={haircolor}
					onChange={props.changeHaircolor}
					options={hairArr}
					/>
				<IconButton icon="&#xE913;" onClick={props.rerollHair} />
			</InputButtonGroup>
			<InputButtonGroup className="reroll">
				<Dropdown
					label={_translate(locale, 'personaldata.eyecolor')}
					value={eyecolor}
					onChange={props.changeEyecolor}
					options={eyesArr}
					/>
				<IconButton icon="&#xE913;" onClick={props.rerollEyes} />
			</InputButtonGroup>
			<InputButtonGroup className="reroll">
				<TextField
					label={_translate(locale, 'personaldata.size')}
					value={size}
					onChange={props.changeSize}
					valid={isEmptyOr(isFloat, size)}
					/>
				<IconButton icon="&#xE913;" onClick={props.rerollSize} />
			</InputButtonGroup>
			<InputButtonGroup className="reroll">
				<TextField
					label={_translate(locale, 'personaldata.weight')}
					value={weight}
					onChange={props.changeWeight}
					valid={isEmptyOr(isNaturalNumber, weight)}
					/>
				<IconButton icon="&#xE913;" onClick={props.rerollWeight} />
			</InputButtonGroup>
			<div>
				<TextField
					label={_translate(locale, 'personaldata.title')}
					value={title}
					onChange={props.changeTitle}
					/>
			</div>
			<div>
				<Dropdown
					label={_translate(locale, 'personaldata.socialstatus')}
					value={socialstatus}
					onChange={props.changeSocialStatus}
					options={socialArr}
					/>
			</div>
			<div>
				<TextField
					label={_translate(locale, 'personaldata.characteristics')}
					value={characteristics}
					onChange={props.changeCharacteristics}
					/>
			</div>
			<div>
				<TextField
					label={_translate(locale, 'personaldata.otherinfo')}
					value={otherinfo}
					onChange={props.changeOtherInfo}
					/>
			</div>
			<div>
				<TextField
					label={_translate(locale, 'personaldata.cultureareaknowledge')}
					value={cultureAreaKnowledge}
					onChange={props.changeCultureAreaKnowledge}
					/>
			</div>
		</div>
	);
}
