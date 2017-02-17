import { get } from '../../stores/ListStore';
import * as React from 'react';
import LabelBox from '../../components/LabelBox';
import TextBox from '../../components/TextBox';

export default () => {
	let bonus = 0;

	const increaseObject = get('ADV_14') as AdvantageInstance;
	const decreaseObject = get('DISADV_31') as DisadvantageInstance;
	if (increaseObject.isActive) {
		bonus += increaseObject.active[0].tier!;
	}
	else if (decreaseObject.isActive) {
		bonus -= decreaseObject.active[0].tier!;
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
