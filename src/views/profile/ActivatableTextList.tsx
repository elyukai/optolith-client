import * as React from 'react';

interface Props {
	list: ActiveViewObject[];
}

export default (props: Props) => {
	const list = props.list.filter(obj => !['SA_28', 'SA_30'].includes(obj.id)).map(obj => {
		const { tiers, id, tier } = obj;
		let { name } = obj;
		const roman = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X'];
		if (tiers && !['DISADV_34', 'DISADV_50'].includes(id)) {
			if (id === 'SA_30' && tier === 4) {
				name += ` MS`;
			}
			else {
				name += ` ${roman[(tier as number) - 1]}`;
			}
		}

		return name;
	}).sort().join(', ');

	return (
		<div className="list">{list}</div>
	);
};
