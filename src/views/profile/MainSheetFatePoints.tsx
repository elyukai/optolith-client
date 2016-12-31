import { get } from '../../stores/ListStore';
import * as React from 'react';
import LabelBox from '../../components/LabelBox';
import TextBox from '../../components/TextBox';

export default () => {
	let bonus = 0;

	if (get('ADV_14').active) {
		bonus += get('ADV_14').tier;
	}
	else if (get('DISADV_31').active) {
		bonus -= get('DISADV_31').tier;
	}

	return (
		<TextBox className="fate-points" label="Schicksalspunkte">
			<LabelBox label="Wert" value="3" />
			<LabelBox label="Bonus" value={bonus} />
			<LabelBox label="Max" value={3 + bonus} />
			<LabelBox label="Aktuell" value="" />
		</TextBox>
	);
}
