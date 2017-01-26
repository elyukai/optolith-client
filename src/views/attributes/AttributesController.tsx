import { AttributeInstance } from '../../utils/data/Attribute';
import Attributes from './Attributes';
import AttributeStore from '../../stores/AttributeStore';
import ELStore from '../../stores/ELStore';
import PhaseStore from '../../stores/PhaseStore';
import React, { Component } from 'react';

interface State {
	attributes: AttributeInstance[];
	baseValues: {
		le: number;
		leAdd: number;
		aeAdd: number;
		keAdd: number;
		sk: number;
		zk: number;
		gs: number;
	};
	el: {
		max_attr: number;
		max_attrsum: number;
	};
	phase: number;
}

export default class AttributesController extends Component<any, State> {

	state = {
		attributes: AttributeStore.getAll(),
		baseValues: AttributeStore.getAddEnergies(),
		el: ELStore.getStart(),
		phase: PhaseStore.get()
	};

	_updateAttributeStore = () => this.setState({
		attributes: AttributeStore.getAll(),
		baseValues: AttributeStore.getAddEnergies()
	} as State);
	_updatePhaseStore = () => this.setState({
		phase: PhaseStore.get()
	} as State);

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
