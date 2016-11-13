import AttributeCalc from './AttributeCalc';
import AttributeList from './AttributeList';
import AttributeStore from '../../stores/AttributeStore';
import ELStore from '../../stores/ELStore';
import PhaseStore from '../../stores/PhaseStore';
import React, { Component } from 'react';
import Scroll from '../../components/Scroll';

class Attribute extends Component {

	state = {
		attributes: AttributeStore.getAllForView(),
		baseValues: AttributeStore.getBaseValues(),
		phase: PhaseStore.get(),
		sum: AttributeStore.getSum()
	};
	
	_updateAttributeStore = () => this.setState({
		attributes: AttributeStore.getAllForView(),
		baseValues: AttributeStore.getBaseValues(),
		sum: AttributeStore.getSum()
	});
	_updatePhaseStore = () => this.setState({
		phase: PhaseStore.get()
	});
	
	componentDidMount() {
		AttributeStore.addChangeListener(this._updateAttributeStore);
		PhaseStore.addChangeListener(this._updatePhaseStore );
	}
	
	componentWillUnmount() {
		AttributeStore.removeChangeListener(this._updateAttributeStore);
		PhaseStore.removeChangeListener(this._updatePhaseStore );
	}

	render() {

		const { baseValues, sum, ...other } = this.state;

		const START_EL = ELStore.getStart();
		const sumMax = sum >= START_EL.max_attrsum;
		const max = START_EL.max_attr;

		const element = this.state.attributes.length === 8 ? (
			<section id="attribute">
				<div className="page">
					<Scroll>
						<div className="counter">Punkte in Eigenschaften: {sum}</div>
						<AttributeList {...other} max={max} sumMax={sumMax} />
						<AttributeCalc {...other} baseValues={baseValues} />
					</Scroll>
				</div>
			</section>
		) : null;
		
		return element;
	}
}

export default Attribute;
