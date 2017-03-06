import * as React from 'react';
import LabelBox from '../../components/LabelBox';
import TextBox from '../../components/TextBox';
import { get } from '../../stores/ListStore';
import { isActive } from '../../utils/ActivatableUtils';

export default () => {
	let bonus = 0;

	const increaseObject = get('ADV_14') as AdvantageInstance;
	const decreaseObject = get('DISADV_31') as DisadvantageInstance;
	if (isActive(increaseObject)) {
		bonus += increaseObject.active[0].tier!;
	}
	else if (isActive(decreaseObject)) {
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
};
