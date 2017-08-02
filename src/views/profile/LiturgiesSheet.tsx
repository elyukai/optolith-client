import * as React from 'react';
import * as SheetActions from '../../actions/SheetActions';
import { Checkbox } from '../../components/Checkbox';
import { SheetStore } from '../../stores/SheetStore';
import { _translate } from '../../utils/I18n';
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

export class LiturgiesSheet extends React.Component<{}, State> {
	state = SheetStore.getAllForSpellsSheet();

	componentDidMount() {
		SheetStore.addChangeListener(this.updateSheetStore);
	}

	componentWillUnmount() {
		SheetStore.removeChangeListener(this.updateSheetStore);
	}

	render() {
		const addHeader = [
			{ id: 'KP_MAX', short: _translate(locale, 'charactersheet.chants.headers.kpmax'), value: getKP().value },
			{ id: 'KP_CURRENT', short: _translate(locale, 'charactersheet.chants.headers.kpcurrent') },
		];

		return (
			<SheetWrapper>
				<SheetOptions>
					<Checkbox
						checked={this.state.checkAttributeValueVisibility}
						onClick={this.switchAttributeValueVisibility}
						>
						{_translate(locale, 'charactersheet.options.showattributevalues')}
					</Checkbox>
				</SheetOptions>
				<Sheet id="liturgies-sheet" title={_translate(locale, 'charactersheet.chants.title')} addHeaderInfo={addHeader}>
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
