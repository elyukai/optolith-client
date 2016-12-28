import Attributes from './Attributes';
import AttributeStore from '../../stores/AttributeStore';
import ELStore from '../../stores/ELStore';
import PhaseStore from '../../stores/PhaseStore';
import React, { Component } from 'react';

export default class AttributesController extends Component {

	state = {
		attributes: AttributeStore.getAll(),
		baseValues: AttributeStore.getBaseValues(),
		el: ELStore.getStart(),
		phase: PhaseStore.get()
	};
	
	_updateAttributeStore = () => this.setState({
		attributes: AttributeStore.getAll(),
		baseValues: AttributeStore.getBaseValues()
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

		const sum = this.state.attributes.reduce((a,b) => a + b.value, 0);

		return (
			<Attributes {...this.state} sum={sum} />
		);
	}
}
