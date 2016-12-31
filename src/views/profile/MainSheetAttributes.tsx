import { SecondaryAttribute } from '../../utils/secondaryAttributes';
import * as React from 'react';
import MainSheetAttributesItem from './MainSheetAttributesItem';
import MainSheetFatePoints from './MainSheetFatePoints';

export interface MainSheetAttributesProps {
	attributes: SecondaryAttribute[];
	baseValues: {
		le: number;
		leAdd: number;
		aeAdd: number;
		keAdd: number;
		sk: number;
		zk: number;
		gs: number;
	};
}

export default (props: MainSheetAttributesProps ) => {
	const { attributes, baseValues } = props;
	return (
		<div className="calculated">
			<div className="calc-header">
				<div>Wert</div>
				<div>Bonus/<br/>Malus</div>
				<div>Zukauf</div>
				<div>Max</div>
			</div>
			<MainSheetAttributesItem
				label={attributes[0].name}
				calc={attributes[0].calc}
				value={attributes[0].value}
				add={attributes[0].mod}
				purchased={attributes[0].currentAdd}
				subLabel="Grundwert"
				subArray={[baseValues.le]} />
			<MainSheetAttributesItem
				label={attributes[1].name}
				calc={attributes[1].calc}
				value={attributes[1].value}
				add={attributes[1].mod}
				purchased={baseValues.aeAdd}
				subLabel="perm. eingesetzt/davon zurückgekauft"
				subArray={[0,0]}
				empty={attributes[1].value === '-'} />
			<MainSheetAttributesItem
				label={attributes[2].name}
				calc={attributes[2].calc}
				value={attributes[2].value}
				add={attributes[2].mod}
				purchased={baseValues.keAdd}
				subLabel="perm. eingesetzt/davon zurückgekauft"
				subArray={[0,0]}
				empty={attributes[2].value === '-'} />
			<MainSheetAttributesItem
				label={attributes[3].name}
				calc={attributes[3].calc}
				value={attributes[3].value}
				add={attributes[3].mod}
				purchased={null}
				subLabel="Grundwert"
				subArray={[baseValues.sk]} />
			<MainSheetAttributesItem
				label={attributes[4].name}
				calc={attributes[4].calc}
				value={attributes[4].value}
				add={attributes[4].mod}
				purchased={null}
				subLabel="Grundwert"
				subArray={[baseValues.zk]} />
			<MainSheetAttributesItem
				label={attributes[5].name}
				calc={attributes[5].calc}
				value={attributes[5].value}
				add={0}
				purchased={null} />
			<MainSheetAttributesItem
				label={attributes[6].name}
				calc={attributes[6].calc}
				value={attributes[6].value}
				add={0}
				purchased={null} />
			<MainSheetAttributesItem
				label={attributes[7].name}
				calc={attributes[7].calc}
				value={attributes[7].value}
				add={0}
				purchased={null}
				subLabel="Grundwert"
				subArray={[baseValues.gs]} />
			<MainSheetFatePoints />
		</div>
	);
}
