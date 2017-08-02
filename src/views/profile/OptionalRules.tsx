import * as React from 'react';
import * as RulesActions from '../../actions/RulesActions';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { Scroll } from '../../components/Scroll';
import { _translate } from '../../utils/I18n';

interface State {
	higherParadeValues: number;
}

export class OptionalRules extends React.Component<{}, State> {
	render() {
		const { attributeValueLimit, higherParadeValues } = this.state;

		return (
			<div className="page" id="optional-rules">
				<Scroll>
					<h3>{_translate(locale, 'rules.rulebase')}</h3>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Regelwerk"
						disabled
						/>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Aventurisches Bestiarium"
						disabled
						/>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Aventurisches Kompendium"
						disabled
						/>
					<Checkbox
						checked={false}
						onClick={this.changeCheckboxTrap}
						label="Aventurisches Götterwirken"
						disabled
						/>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Aventurische Magie I"
						disabled
						/>
					<Checkbox
						checked={false}
						onClick={this.changeCheckboxTrap}
						label="Aventurische Magie II"
						disabled
						/>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Aventurische Namen"
						disabled
						/>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Aventurische Rüstkammer"
						disabled
						/>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Die Streitenden Königreiche"
						disabled
						/>
					<Checkbox
						checked={false}
						onClick={this.changeCheckboxTrap}
						label="Die Siebenwindküste"
						disabled
						/>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Kneipen &amp; Tavernen"
						disabled
						/>
					<h3>{_translate(locale, 'rules.optionalrules')}</h3>
					<div className="extended">
						<Checkbox
							checked={higherParadeValues > 0}
							onClick={this.switchHigherParadeValues}
							label={_translate(locale, 'rules.optionalrules.higherdefensestats')}
							/>
						<Dropdown
							options={[{id: 2, name: '+2'}, {id: 4, name: '+4'}]}
							value={higherParadeValues}
							onChange={this.changeHigherParadeValues}
							disabled={higherParadeValues === 0}
							/>
					</div>
					<Checkbox
						checked={attributeValueLimit}
						onClick={this.changeAttributeValueLimit}
						label={_translate(locale, 'rules.optionalrules.maximumattributescores')}
						/>
				</Scroll>
			</div>
		);
	}

	private switchHigherParadeValues = () => {
		RulesActions.setHigherParadeValues(this.state.higherParadeValues > 0 ? 0 : 2);
	}
	private changeHigherParadeValues = (id: number) => RulesActions.setHigherParadeValues(id);
	private changeAttributeValueLimit = () => RulesActions.switchAttributeValueLimit();
	private changeCheckboxTrap = () => undefined;
}
