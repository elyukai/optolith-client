import * as React from 'react';
import * as SheetActions from '../../actions/SheetActions';
import { Checkbox } from '../../components/Checkbox';
import { SheetStore } from '../../stores/SheetStore';
import { getAE } from '../../utils/secondaryAttributes';
import { AttributeMods } from './AttributeMods';
import { Sheet } from './Sheet';
import { SheetOptions } from './SheetOptions';
import { SheetWrapper } from './SheetWrapper';
import { SpellsSheetCantrips } from './SpellsSheetCantrips';
import { SpellsSheetMain } from './SpellsSheetMain';
import { SpellsSheetSpecialAbilities } from './SpellsSheetSpecialAbilities';
import { SpellsSheetTraditionsProperties } from './SpellsSheetTraditionsProperties';

interface State {
	checkAttributeValueVisibility: boolean;
}

export class SpellsSheet extends React.Component<undefined, State> {
	state = SheetStore.getAllForSpellsSheet();

	componentDidMount() {
		SheetStore.addChangeListener(this.updateSheetStore);
	}

	componentWillUnmount() {
		SheetStore.removeChangeListener(this.updateSheetStore);
	}

	render() {
		const addHeader = [
			{ id: 'AE_MAX', short: 'AsP Max.', value: getAE().value },
			{ id: 'AE_CURRENT', short: 'Aktuell' },
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
				<Sheet id="spells-sheet" title="Zauber &amp; Rituale" addHeaderInfo={addHeader}>
					<div className="all">
						<SpellsSheetMain attributeValueVisibility={this.state.checkAttributeValueVisibility} />
						<AttributeMods />
						<SpellsSheetTraditionsProperties />
						<SpellsSheetSpecialAbilities />
						<SpellsSheetCantrips />
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
