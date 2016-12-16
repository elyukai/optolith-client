import AttributeStore from '../../stores/AttributeStore';
import APStore from '../../stores/APStore';
import CultureStore from '../../stores/CultureStore';
import DisAdvStore from '../../stores/DisAdvStore';
import ELStore from '../../stores/ELStore';
import { getPrimaryAttrID } from '../../stores/ListStore';
import MainSheetCalc from './MainSheetCalc';
import MainSheetPersonalData from './MainSheetPersonalData';
import OverviewConstSkills from './OverviewConstSkills';
import ProfileStore from '../../stores/ProfileStore';
import ProfessionStore from '../../stores/ProfessionStore';
import ProfessionVariantStore from '../../stores/ProfessionVariantStore';
import RaceStore from '../../stores/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import SpecialAbilitiesStore from '../../stores/SpecialAbilitiesStore';
import TextBox from '../../components/TextBox';

export default class MainSheet extends Component {
	render() {

		const ap = APStore.getAll();
		const el = ELStore.getStart().name;
		const profile = ProfileStore.getAll();
		const race = RaceStore.getCurrentName();
		const culture = CultureStore.getCurrentName();
		const profession = ProfessionVariantStore.getCurrentName() !== null ? `${ProfessionStore.getCurrentName()} (${ProfessionVariantStore.getCurrentName()})` : ProfessionStore.getCurrentName();
		const haircolorTags = ProfileStore.getHaircolorTags();
		const eyecolorTags = ProfileStore.getEyecolorTags();
		const socialstatusTags = ProfileStore.getSocialstatusTags();

		const advActive = DisAdvStore.getActiveForView(true);
		const disadvActive = DisAdvStore.getActiveForView(false);
		const commonsaActive = SpecialAbilitiesStore.getActiveForView(1,2);

		const attributes = AttributeStore.getAllForView();
		const attrPrimary = [getPrimaryAttrID(1), getPrimaryAttrID(2)];
		const baseValues = AttributeStore.getBaseValues();

		return (
			<div className="sheet main">
				<SheetHeader title="Persönliche Daten" />
				<MainSheetPersonalData
					ap={ap}
					culture={culture}
					el={el}
					eyecolorTags={eyecolorTags}
					haircolorTags={haircolorTags}
					profession={profession}
					profile={profile}
					race={race}
					socialstatusTags={socialstatusTags}
					/>
				<div className="lower">
					<div className="lists">
						<TextBox className="adv" label="Vorteile">
							<OverviewConstSkills list={advActive} />
						</TextBox>
						<TextBox className="disadv" label="Nachteile">
							<OverviewConstSkills list={disadvActive} />
						</TextBox>
						<TextBox className="common_special" label="Allgemeine Sonderfertigkeiten">
							<OverviewConstSkills list={commonsaActive} />
						</TextBox>
					</div>
					<MainSheetCalc
						attributes={attributes}
						attrPrimary={attrPrimary}
						baseValues={baseValues}
						/>
				</div>
			</div>
		);
	}
}
