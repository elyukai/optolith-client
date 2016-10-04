import AttributeListItem from './AttributeListItem';
import React, { Component, PropTypes } from 'react';

class AttributeList extends Component {

	static propTypes = {
		attributes: PropTypes.array.isRequired,
		max: PropTypes.number.isRequired,
		sumMax: PropTypes.bool.isRequired
	};

	constructor(props) {
		super(props);
	}

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

export default AttributeList;
