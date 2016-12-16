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
		phase: PhaseStore.get(),
		sum: AttributeStore.getSum()
	};
	
	_updateAttributeStore = () => this.setState({
		attributes: AttributeStore.getAll(),
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
		return (
			<Attributes {...this.state} />
		);
	}
}
