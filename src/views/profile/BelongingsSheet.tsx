import { get } from '../../stores/ListStore';
import * as React from 'react';
import EquipmentStore from '../../stores/EquipmentStore';
import LabelBox from '../../components/LabelBox';
import SheetHeader from './SheetHeader';
import TextBox from '../../components/TextBox';

export default () => {
	const { value } = get('STR') as AttributeInstance;
	const { d, s, h, k } = EquipmentStore.getPurse();

	return (
		<div className="sheet" id="belongings">
			<SheetHeader title="Besitz" />
			<div className="upper">
				<TextBox label="Ausrüstung" className="equipment">

				</TextBox>
				<TextBox label="Geldbeutel" className="purse">
					<div className="top">
						<LabelBox
							className="money"
							label="Dukaten"
							value={d}
							/>
						<LabelBox
							className="money"
							label="Silbertaler"
							value={s}
							/>
						<LabelBox
							className="money"
							label="Heller"
							value={h}
							/>
						<LabelBox
							className="money"
							label="Kreuzer"
							value={k}
							/>
						<LabelBox
							className="specifics"
							label="Edelsteine"
							value=""
							/>
						<LabelBox
							className="specifics"
							label="Schmuck"
							value=""
							/>
						<LabelBox
							className="specifics"
							label="Sonstiges"
							value=""
							/>
					</div>
					<div className="fill"></div>
					<div className="carrying-capacity">
						<div>
							<h4>Tragkraft</h4>
							<p className="sub">(KKx2)</p>
						</div>
						<LabelBox
							label="Wert in Stein"
							value={value * 2}
							/>
					</div>
				</TextBox>
			</div>
		</div>
	);
};
