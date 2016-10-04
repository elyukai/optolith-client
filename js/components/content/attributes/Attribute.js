import AttributeCalc from './AttributeCalc';
import AttributeList from './AttributeList';
import AttributeStore from '../../../stores/AttributeStore';
import ELStore from '../../../stores/ELStore';
import React, { Component } from 'react';
import Scroll from '../../layout/Scroll';

class Attribute extends Component {

	state = {
		attributes: AttributeStore.getAllForView(),
		baseValues: AttributeStore.getBaseValues(),
		sum: AttributeStore.getSum()
	};

	constructor(props) {
		super(props);
	}
	
	_updateAttributeStore = () => this.setState({
		attributes: AttributeStore.getAllForView(),
		baseValues: AttributeStore.getBaseValues(),
		sum: AttributeStore.getSum()
	});
	
	componentDidMount() {
		AttributeStore.addChangeListener(this._updateAttributeStore);
	}
	
	componentWillUnmount() {
		AttributeStore.removeChangeListener(this._updateAttributeStore);
	}

	render() {

		const START_EL = ELStore.getStart();
		const sumMax = this.state.sum >= START_EL.max_attrsum;
		const max = START_EL.max_attr;

		const element = this.state.attributes.length === 8 ? (
			<section id="attribute">
				<div className="page">
					<Scroll>
						<div className="counter">Punkte in Eigenschaften: {this.state.sum}</div>
						<AttributeList attributes={this.state.attributes} max={max} sumMax={sumMax} />
						<AttributeCalc attributes={this.state.attributes} baseValues={this.state.baseValues} />
					</Scroll>
				</div>
			</section>
		) : null;
		
		return element;
	}
}

export default Attribute;
