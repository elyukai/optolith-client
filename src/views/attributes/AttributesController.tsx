import * as React from 'react';
import { AttributeStore } from '../../stores/AttributeStore';
import { ELStore } from '../../stores/ELStore';
import { PhaseStore } from '../../stores/PhaseStore';
import { AttributeInstance, ExperienceLevel } from '../../types/data.d';
import { Attributes } from './Attributes';

export interface State {
	attributes: AttributeInstance[];
	el: ExperienceLevel;
	phase: number;
}

export class AttributesController extends React.Component<{}, State> {
	state = {
		attributes: AttributeStore.getAll(),
		el: ELStore.getStart(),
		phase: PhaseStore.get(),
	};

	_updateAttributeStore = () => this.setState({ attributes: AttributeStore.getAll() } as State);
	_updatePhaseStore = () => this.setState({ phase: PhaseStore.get() } as State);

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
