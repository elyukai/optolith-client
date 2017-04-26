import * as React from 'react';
import * as SheetActions from '../../actions/SheetActions';
import { Checkbox } from '../../components/Checkbox';
import { SheetStore } from '../../stores/SheetStore';
import { getKP } from '../../utils/secondaryAttributes';
import { AttributeMods } from './AttributeMods';
import { LiturgiesSheetBlessings } from './LiturgiesSheetBlessings';
import { LiturgiesSheetMain } from './LiturgiesSheetMain';
import { LiturgiesSheetSpecialAbilities } from './LiturgiesSheetSpecialAbilities';
import { LiturgiesSheetTraditionsAspects } from './LiturgiesSheetTraditionsAspects';
import { Sheet } from './Sheet';
import { SheetOptions } from './SheetOptions';
import { SheetWrapper } from './SheetWrapper';

interface State {
	checkAttributeValueVisibility: boolean;
}

export class LiturgiesSheet extends React.Component<undefined, State> {
	state = SheetStore.getAllForSpellsSheet();

	componentDidMount() {
		SheetStore.addChangeListener(this.updateSheetStore);
	}

	componentWillUnmount() {
		SheetStore.removeChangeListener(this.updateSheetStore);
	}

	render() {
		const addHeader = [
			{ id: 'KP_MAX', short: 'KaP Max.', value: getKP().value },
			{ id: 'KP_CURRENT', short: 'Aktuell' },
		];

		return (
			<SheetWrapper>
				<SheetOptions>
					<Checkbox
						checked={this.state.checkAttributeValueVisibility}
						onClick={this.switchAttributeValueVisibility}
						>
						Attributwerte anzeigen
					</Checkbox>
				</SheetOptions>
				<Sheet id="liturgies" title="Liturgien &amp; Zeremonien" addHeaderInfo={addHeader}>
					<div className="all">
						<LiturgiesSheetMain attributeValueVisibility={this.state.checkAttributeValueVisibility} />
						<AttributeMods />
						<LiturgiesSheetTraditionsAspects />
						<LiturgiesSheetSpecialAbilities />
						<LiturgiesSheetBlessings />
					</div>
				</Sheet>
			</SheetWrapper>
		);
	}

	private switchAttributeValueVisibility = () => {
		SheetActions.switchAttributeValueVisibility();
	}

	private updateSheetStore = () => {
		this.setState(SheetStore.getAllForSpellsSheet());
	}
}
