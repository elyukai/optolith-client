import * as React from 'react';
import { RaceStore } from '../../stores/RaceStore';
import { SecondaryAttribute } from '../../types/data.d';
import { translate } from '../../utils/I18n';
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
				<div>{translate('charactersheet.main.headers.value')}</div>
				<div>{translate('charactersheet.main.headers.bonuspenalty')}</div>
				<div>{translate('charactersheet.main.headers.bought')}</div>
				<div>{translate('charactersheet.main.headers.max')}</div>
			</div>
			<MainSheetAttributesItem
				label={attributes[0].name}
				calc={attributes[0].calc}
				base={attributes[0].base}
				max={attributes[0].value}
				add={attributes[0].mod}
				purchased={attributes[0].currentAdd}
				subLabel={translate('charactersheet.main.subheaders.basestat')}
				subArray={[race.lp]}
				/>
			<MainSheetAttributesItem
				label={attributes[1].name}
				calc={attributes[1].calc}
				base={attributes[1].base}
				max={attributes[1].value}
				add={attributes[1].mod}
				purchased={attributes[1].currentAdd}
				subLabel={translate('charactersheet.main.subheaders.permanent')}
				subArray={[attributes[1].permanentLost!, attributes[1].permanentRedeemed!]}
				empty={attributes[1].value === '-'}
				/>
			<MainSheetAttributesItem
				label={attributes[2].name}
				calc={attributes[2].calc}
				base={attributes[2].base}
				max={attributes[2].value}
				add={attributes[2].mod}
				purchased={attributes[2].currentAdd}
				subLabel={translate('charactersheet.main.subheaders.permanent')}
				subArray={[attributes[2].permanentLost!, attributes[2].permanentRedeemed!]}
				empty={typeof attributes[2].value === 'string'}
				/>
			<MainSheetAttributesItem
				label={attributes[3].name}
				calc={attributes[3].calc}
				base={attributes[3].base}
				max={attributes[3].value}
				add={attributes[3].mod}
				subLabel={translate('charactersheet.main.subheaders.basestat')}
				subArray={[race.spi]}
				/>
			<MainSheetAttributesItem
				label={attributes[4].name}
				calc={attributes[4].calc}
				base={attributes[4].base}
				max={attributes[4].value}
				add={attributes[4].mod}
				subLabel={translate('charactersheet.main.subheaders.basestat')}
				subArray={[race.tou]}
				/>
			<MainSheetAttributesItem
				label={attributes[5].name}
				calc={attributes[5].calc}
				base={attributes[5].base}
				max={attributes[5].value}
				/>
			<MainSheetAttributesItem
				label={attributes[6].name}
				calc={attributes[6].calc}
				base={attributes[6].base}
				max={attributes[6].value}
				/>
			<MainSheetAttributesItem
				label={attributes[7].name}
				calc={attributes[7].calc}
				base={attributes[7].base}
				max={attributes[7].value}
				add={attributes[7].mod}
				subLabel={translate('charactersheet.main.subheaders.basestat')}
				subArray={[race.mov]}
				/>
			<MainSheetFatePoints />
		</div>
	);
}
