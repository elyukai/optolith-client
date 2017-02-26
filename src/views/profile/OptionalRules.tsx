import * as React from 'react';
import * as RulesActions from '../../actions/RulesActions';
import Checkbox from '../../components/Checkbox';
import Dropdown from '../../components/Dropdown';
import RulesStore from '../../stores/RulesStore';
import Scroll from '../../components/Scroll';

interface State {
	higherParadeValues: number;
}

export default class ProfileOverview extends React.Component<undefined, State> {

	state = RulesStore.getAll();

	_updateRulesStore = () => this.setState(RulesStore.getAll());

	componentDidMount() {
		RulesStore.addChangeListener(this._updateRulesStore );
	}

	componentWillUnmount() {
		RulesStore.removeChangeListener(this._updateRulesStore );
	}

	render() {
		const { higherParadeValues } = this.state;

		return (
			<div className="page" id="optional-rules">
				<Scroll>
					<div className="options">
						<Checkbox
							checked={higherParadeValues > 0}
							onClick={() => RulesActions.setHigherParadeValues(higherParadeValues > 0 ? 0 : 2)}
							label="Höhere Verteidigungswerte"
							>
						</Checkbox>
						<Dropdown
							options={[{id:2,name:'+2'},{id:4,name:'+4'}]}
							value={higherParadeValues}
							onChange={(id: number) => RulesActions.setHigherParadeValues(id)}
							disabled={higherParadeValues === 0}
							/>
					</div>
					<Checkbox
						checked={false}
						onClick={() => null}
						label="Eigenschaftsobergrenze"
						disabled
						/>
				</Scroll>
			</div>
		);
	}
}
