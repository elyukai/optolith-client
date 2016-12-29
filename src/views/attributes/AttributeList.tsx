import { AttributeInstance } from '../../utils/data/Attribute';
import AttributeListItem from './AttributeListItem';
import React, { Component, PropTypes } from 'react';

interface Props {
	attributes: AttributeInstance[];
	max: number;
	phase: number;
	sumMax: boolean;
}

export default class AttributeList extends Component<Props, any> {

	static propTypes = {
		attributes: PropTypes.array.isRequired,
		max: PropTypes.number.isRequired,
		phase: PropTypes.number.isRequired,
		sumMax: PropTypes.bool.isRequired
	};

	render() {

		const { attributes, ...other } = this.props;

		return (
			<div className="main">
				{
					attributes.map(attribute => <AttributeListItem {...other} key={attribute.id} attribute={attribute} />)
				}
			</div>
		);
	}
}
