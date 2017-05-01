import * as React from 'react';
import { getLocale } from '../../stores/LocaleStore';
import { RaceStore } from '../../stores/RaceStore';
import { SecondaryAttribute } from '../../types/data.d';
import { MainSheetAttributesItem } from './MainSheetAttributesItem';
import { MainSheetFatePoints } from './MainSheetFatePoints';

export interface MainSheetAttributesProps {
	attributes: SecondaryAttribute[];
}

export function MainSheetAttributes(props: MainSheetAttributesProps ) {
	const { attributes } = props;
	const race = RaceStore.getCurrent()!;
	return (
		<div className="calculated">
			<div className="calc-header">
				<div>{getLocale()['charactersheet.main.headers.value']}</div>
				<div>{getLocale()['charactersheet.main.headers.bonuspenalty']}</div>
				<div>{getLocale()['charactersheet.main.headers.bought']}</div>
				<div>{getLocale()['charactersheet.main.headers.max']}</div>
			</div>
			<MainSheetAttributesItem
				label={attributes[0].name}
				calc={attributes[0].calc}
				value={attributes[0].value}
				add={attributes[0].mod}
				purchased={attributes[0].currentAdd}
				subLabel={getLocale()['charactersheet.main.subheaders.basestat']}
				subArray={[race.lp]} />
			<MainSheetAttributesItem
				label={attributes[1].name}
				calc={attributes[1].calc}
				value={attributes[1].value}
				add={attributes[1].mod}
				purchased={attributes[1].currentAdd}
				subLabel={getLocale()['charactersheet.main.subheaders.permanent']}
				subArray={[attributes[1].permanentLost!, attributes[1].permanentRedeemed!]}
				empty={attributes[1].value === '-'} />
			<MainSheetAttributesItem
				label={attributes[2].name}
				calc={attributes[2].calc}
				value={attributes[2].value}
				add={attributes[2].mod}
				purchased={attributes[2].currentAdd}
				subLabel={getLocale()['charactersheet.main.subheaders.permanent']}
				subArray={[attributes[2].permanentLost!, attributes[2].permanentRedeemed!]}
				empty={typeof attributes[2].value === 'string'} />
			<MainSheetAttributesItem
				label={attributes[3].name}
				calc={attributes[3].calc}
				value={attributes[3].value}
				add={attributes[3].mod}
				subLabel={getLocale()['charactersheet.main.subheaders.basestat']}
				subArray={[race.spi]} />
			<MainSheetAttributesItem
				label={attributes[4].name}
				calc={attributes[4].calc}
				value={attributes[4].value}
				add={attributes[4].mod}
				subLabel={getLocale()['charactersheet.main.subheaders.basestat']}
				subArray={[race.tou]} />
			<MainSheetAttributesItem
				label={attributes[5].name}
				calc={attributes[5].calc}
				value={attributes[5].value} />
			<MainSheetAttributesItem
				label={attributes[6].name}
				calc={attributes[6].calc}
				value={attributes[6].value} />
			<MainSheetAttributesItem
				label={attributes[7].name}
				calc={attributes[7].calc}
				value={attributes[7].value}
				subLabel={getLocale()['charactersheet.main.subheaders.basestat']}
				subArray={[race.mov]} />
			<MainSheetFatePoints />
		</div>
	);
}
