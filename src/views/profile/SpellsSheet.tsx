import * as React from 'react';
import * as SheetActions from '../../actions/SheetActions';
import { Checkbox } from '../../components/Checkbox';
import { SheetStore } from '../../stores/SheetStore';
import { translate } from '../../utils/I18n';
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

export class SpellsSheet extends React.Component<{}, State> {
	state = SheetStore.getAllForSpellsSheet();

	componentDidMount() {
		SheetStore.addChangeListener(this.updateSheetStore);
	}

	componentWillUnmount() {
		SheetStore.removeChangeListener(this.updateSheetStore);
	}

	render() {
		const addHeader = [
			{ id: 'AE_MAX', short: translate('charactersheet.spells.headers.aemax'), value: getAE().value },
			{ id: 'AE_CURRENT', short: translate('charactersheet.spells.headers.aecurrent') },
		];

		return (
			<SheetWrapper>
				<SheetOptions>
					<Checkbox
						checked={this.state.checkAttributeValueVisibility}
						onClick={this.switchAttributeValueVisibility}
						>
						{translate('charactersheet.options.showattributevalues')}
					</Checkbox>
				</SheetOptions>
				<Sheet id="spells-sheet" title={translate('charactersheet.spells.title')} addHeaderInfo={addHeader}>
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
