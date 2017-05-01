import * as React from 'react';
import * as RulesActions from '../../actions/RulesActions';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { Scroll } from '../../components/Scroll';
import { getLocale } from '../../stores/LocaleStore';
import { RulesStore } from '../../stores/RulesStore';

interface State {
	higherParadeValues: number;
}

export class OptionalRules extends React.Component<undefined, State> {
	state = RulesStore.getAll();

	componentDidMount() {
		RulesStore.addChangeListener(this.updateRulesStore );
	}

	componentWillUnmount() {
		RulesStore.removeChangeListener(this.updateRulesStore );
	}

	render() {
		const { attributeValueLimit, higherParadeValues } = this.state;

		return (
			<div className="page" id="optional-rules">
				<Scroll>
					<h3>{getLocale()['rules.rulebase']}</h3>
					<Checkbox
						checked
						onClick={this.changeCheckboxTrap}
						label="Regelwerk"
						disabled
						/>
					<Checkbox
						checked={false}
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
						label="Aventurische Magie I"
						disabled
						/>
					<Checkbox
						checked={false}
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
						checked={false}
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
						checked={false}
						onClick={this.changeCheckboxTrap}
						label="Tavernen"
						disabled
						/>
					<h3>{getLocale()['rules.optionalrules']}</h3>
					<div className="extended">
						<Checkbox
							checked={higherParadeValues > 0}
							onClick={this.switchHigherParadeValues}
							label="Höhere Verteidigungswerte"
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
						label="Eigenschaftsobergrenze"
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
	private updateRulesStore = () => this.setState(RulesStore.getAll());
}
