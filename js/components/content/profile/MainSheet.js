import AttributeStore from '../../../stores/AttributeStore';
import APStore from '../../../stores/APStore';
import Avatar from '../../layout/Avatar';
import Box from '../../layout/sheets/Box';
import CultureStore from '../../../stores/rcp/CultureStore';
import DisAdvStore from '../../../stores/DisAdvStore';
import ELStore from '../../../stores/ELStore';
import LabelBox from '../../layout/sheets/LabelBox';
import ListStore from '../../../stores/ListStore';
import MainSheetCalcItem from './MainSheetCalcItem';
import OverviewDisAdv from './OverviewDisAdv';
import Plain from '../../layout/sheets/Plain';
import ProfileStore from '../../../stores/ProfileStore';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../../../stores/rcp/ProfessionVariantStore';
import RaceStore from '../../../stores/rcp/RaceStore';
import React, { Component } from 'react';
import SheetHeader from './SheetHeader';
import TextBox from '../../layout/sheets/TextBox';

class MainSheet extends Component {

	constructor(props) {
		super(props);
	}

	render() {

		const source = {
			attributes: AttributeStore.getAllForView(),
			baseValues: AttributeStore.getBaseValues(),
			race: RaceStore.getCurrentName(),
			culture: CultureStore.getCurrentName(),
			profession: ProfessionVariantStore.getCurrentName() !== null ? `${ProfessionStore.getCurrentName()} (${ProfessionVariantStore.getCurrentName()})` : ProfessionStore.getCurrentName(),
			el: ELStore.getStart().name,
			apTotal: APStore.get(),
			apUsed: APStore.getUsed(),
			advActive: DisAdvStore.getActiveForView(true),
			disadvActive: DisAdvStore.getActiveForView(false),
			name: ProfileStore.getName(),
			portrait: ProfileStore.getPortrait()
		};

		const { attributes, baseValues, race, culture, profession, el, apTotal, apUsed, advActive, disadvActive, name, portrait } = source;

		const attrPrimary = [ListStore.getPrimaryAttrID(1), ListStore.getPrimaryAttrID(2)];

		return (
			<div className="sheet main">
				<SheetHeader title="Persönliche Daten" />
				<div className="upper">
					<div className="info">
						<Plain className="name" label="Name" value={name} />
						<Plain className="family" label="Familie" />
						<Plain className="placeofbirth" label="Geburtsort" />
						<Plain className="dateofbirth" label="Geburtsdatum" />
						<Plain className="age" label="Alter" />
						<Plain className="gender" label="Geschlecht" />
						<Plain className="race" label="Spezies" value={race} />
						<Plain className="size" label="Größe" />
						<Plain className="weight" label="Gewicht" />
						<Plain className="haircolor" label="Haarfarbe" />
						<Plain className="eyecolor" label="Augenfarbe" />
						<Plain className="culture" label="Kultur" value={culture} />
						<Plain className="profession" label="Profession" value={profession} />
						<Plain className="title" label="Titel" />
						<Plain className="socialstatus" label="Sozialstatus" />
						<Plain className="characteristics" label="Charakteristika" />
						<Plain className="other" label="Sonstiges" />
					</div>
					<div className="ap-portrait">
						<LabelBox className="el" label="Erfahrungsgrad" value={el} />
						<LabelBox className="ap-total" label="AP gesamt" value={apTotal} />
						<LabelBox className="portrait" label="Porträt/Wappen"><Avatar src={portrait} /></LabelBox>
						<LabelBox className="ap-available" label="AP verfügbar" value={apTotal - apUsed} />
						<LabelBox className="ap-used" label="AP ausgegeben" value={apUsed} />
					</div>
				</div>
				<div className="lower">
					<div className="lists">
						<TextBox className="adv" label="Vorteile">
							<OverviewDisAdv list={advActive} />
						</TextBox>
						<TextBox className="disadv" label="Nachteile">
							<OverviewDisAdv list={disadvActive} />
						</TextBox>
						<TextBox className="common_special" label="Allgemeine Sonderfertigkeiten">
							<div></div>
						</TextBox>
					</div>
					{
						attributes.length > 0 ? (
							<div className="calculated">
								<div className="calc-header">
									<div>Wert</div>
									<div>Bonus/<br/>Malus</div>
									<div>Zukauf</div>
									<div>Max</div>
								</div>
								<MainSheetCalcItem
									label="Lebensenergie"
									calc="(GW der Spezies + KO + KO)"
									value={baseValues.le + attributes[6].value * 2}
									add={do {
										if (DisAdvStore.get('ADV_25') && DisAdvStore.get('ADV_25').active)
											DisAdvStore.get('ADV_25').tier;
										else if (DisAdvStore.get('DISADV_28') && DisAdvStore.get('DISADV_28').active)
											-DisAdvStore.get('DISADV_28').tier;
										else
											0;
									}}
									purchased={baseValues.leAdd}
									subLabel="Grundwert"
									subArray={[baseValues.le]} />
								<MainSheetCalcItem
									label="Astralenergie"
									calc="(20 durch Zauberer + Leiteigenschaft)"
									value={attrPrimary[0] === 'ATTR_0' || !AttributeStore.get(attrPrimary[0]) ? 0 : 20 + AttributeStore.get(attrPrimary[0]).value}
									add={do {
										if (DisAdvStore.get('ADV_23') && DisAdvStore.get('ADV_23').active)
											DisAdvStore.get('ADV_23').tier;
										else if (DisAdvStore.get('DISADV_26') && DisAdvStore.get('DISADV_26').active)
											-DisAdvStore.get('DISADV_26').tier;
										else
											0;
									}}
									purchased={baseValues.aeAdd}
									subLabel="perm. eingesetzt/davon zurückgekauft"
									subArray={[0,0]}
									empty={attrPrimary[0] === 'ATTR_0'} />
								<MainSheetCalcItem
									label="Karmaenergie"
									calc="(20 durch Geweihter + Leiteigenschaft)"
									value={attrPrimary[1] === 'ATTR_0' || !AttributeStore.get(attrPrimary[1]) ? 0 : 20 + AttributeStore.get(attrPrimary[1]).value}
									add={do {
										if (DisAdvStore.get('ADV_24') && DisAdvStore.get('ADV_24').active)
											DisAdvStore.get('ADV_24').tier;
										else if (DisAdvStore.get('DISADV_27') && DisAdvStore.get('DISADV_27').active)
											-DisAdvStore.get('DISADV_27').tier;
										else
											0;
									}}
									purchased={baseValues.keAdd}
									subLabel="perm. eingesetzt/davon zurückgekauft"
									subArray={[0,0]}
									empty={attrPrimary[1] === 'ATTR_0'} />
								<MainSheetCalcItem
									label="Seelenkraft"
									calc="(GW der Spezies + (MU + KL + IN)/6)"
									value={baseValues.sk + Math.round((attributes[0].value + attributes[1].value + attributes[2].value) / 6)}
									add={do {
										if (DisAdvStore.get('ADV_26') && DisAdvStore.get('ADV_26').active)
											1;
										else if (DisAdvStore.get('DISADV_29') && DisAdvStore.get('DISADV_29').active)
											-1;
										else
											0;
									}}
									purchased={null}
									subLabel="Grundwert"
									subArray={[baseValues.sk]} />
								<MainSheetCalcItem
									label="Zähigkeit"
									calc="(GW der Spezies + (KO + KO + KK)/6)"
									value={baseValues.zk + Math.round((attributes[6].value * 2 + attributes[7].value) / 6)}
									add={do {
										if (DisAdvStore.get('ADV_27') && DisAdvStore.get('ADV_27').active)
											1;
										else if (DisAdvStore.get('DISADV_30') && DisAdvStore.get('DISADV_30').active)
											-1;
										else
											0;
									}}
									purchased={null}
									subLabel="Grundwert"
									subArray={[baseValues.zk]} />
								<MainSheetCalcItem
									label="Ausweichen"
									calc="(GE/2)"
									value={Math.round(attributes[5].value / 2)}
									add={0}
									purchased={null} />
								<MainSheetCalcItem
									label="Initiative"
									calc="(MU + GE)/2"
									value={Math.round((attributes[0].value + attributes[5].value) / 2)}
									add={0}
									purchased={null} />
								<MainSheetCalcItem
									label="Geschwindigkeit"
									calc="(GW der Spezies, mögl. Einbeinig)"
									value={baseValues.gs}
									add={0}
									purchased={null}
									subLabel="Grundwert"
									subArray={[baseValues.gs]} />
								<div className="fate">
									<h3>Schicksalspunkte</h3>
								</div>
							</div>
						) : null
					}
				</div>
			</div>
		);
	}
}

export default MainSheet;
