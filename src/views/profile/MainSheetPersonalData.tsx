import * as React from 'react';
import { Avatar } from '../../components/Avatar';
import { LabelBox } from '../../components/LabelBox';
import { Plain } from '../../components/Plain';
import { CultureInstance, ProfessionInstance, ProfessionVariantInstance, RaceInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';

export interface MainSheetPersonalDataProps {
	ap: {
		spent: number;
		total: number;
	};
	culture: CultureInstance;
	el: string;
	eyecolorTags: string[];
	haircolorTags: string[];
	profession: ProfessionInstance;
	professionVariant?: ProfessionVariantInstance;
	profile: {
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
	};
	race: RaceInstance;
	socialstatusTags: string[];
}

export function MainSheetPersonalData(props: MainSheetPersonalDataProps) {
	const { ap, culture, el, eyecolorTags, haircolorTags, profession, professionVariant, profile: { name, family, placeofbirth, dateofbirth, age, sex, size, weight, haircolor, eyecolor, title, socialstatus, characteristics, otherinfo, avatar }, race, socialstatusTags } = props;

	const raceName = race.name;
	const cultureName = culture.name;
	const professionName = (() => {
		let { name, subname } = profession || { name: 'Loading...', subname: null };
		if (typeof name === 'object') {
			name = name[sex];
		}
		if (typeof subname === 'object') {
			subname = subname[sex];
		}
		let { name: vname } = professionVariant || { name: 'Loading...' };
		if (typeof vname === 'object') {
			vname = vname[sex];
		}
		return name + (subname ? ` (${subname})` : professionVariant ? ` (${vname})` : '');
	})();

	const haircolorName = haircolorTags[haircolor - 1];
	const eyecolorName = eyecolorTags[eyecolor - 1];
	const socialstatusName = socialstatusTags[socialstatus - 1];

	return (
		<div className="upper">
			<div className="info">
				<Plain className="name" label={translate('charactersheet.main.heroname')} value={name} />
				<Plain className="family" label={translate('charactersheet.main.family')} value={family} />
				<Plain className="placeofbirth" label={translate('charactersheet.main.placeofbirth')} value={placeofbirth} />
				<Plain className="dateofbirth" label={translate('charactersheet.main.dateofbirth')} value={dateofbirth} />
				<Plain className="age" label={translate('charactersheet.main.age')} value={age} />
				<Plain className="sex" label={translate('charactersheet.main.sex')} value={sex} />
				<Plain className="race" label={translate('charactersheet.main.race')} value={raceName} />
				<Plain className="size" label={translate('charactersheet.main.size')} value={size} />
				<Plain className="weight" label={translate('charactersheet.main.weight')} value={weight} />
				<Plain className="haircolor" label={translate('charactersheet.main.haircolor')} value={haircolorName} />
				<Plain className="eyecolor" label={translate('charactersheet.main.eyecolor')} value={eyecolorName} />
				<Plain className="culture" label={translate('charactersheet.main.culture')} value={cultureName} />
				<Plain className="socialstatus" label={translate('charactersheet.main.socialstatus')} value={socialstatusName} />
				<Plain className="profession" label={translate('charactersheet.main.profession')} value={professionName} />
				<Plain className="title" label={translate('charactersheet.main.herotitle')} value={title} />
				<Plain className="characteristics" label={translate('charactersheet.main.characteristics')} value={characteristics} />
				<Plain className="otherinfo" label={translate('charactersheet.main.otherinfo')} value={otherinfo} />
			</div>
			<div className="ap-portrait">
				<LabelBox className="el" label={translate('charactersheet.main.experiencelevel')} value={el} />
				<LabelBox className="ap-total" label={translate('charactersheet.main.totalap')} value={ap.total} />
				<LabelBox className="portrait" label={translate('charactersheet.main.avatar')}><Avatar src={avatar} img /></LabelBox>
				<LabelBox className="ap-available" label={translate('charactersheet.main.apcollected')} value={ap.total - ap.spent} />
				<LabelBox className="ap-used" label={translate('charactersheet.main.apspent')} value={ap.spent} />
			</div>
		</div>
	);
}
