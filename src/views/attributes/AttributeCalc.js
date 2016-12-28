import AttributeCalcItem from './AttributeCalcItem';
import React, { Component, PropTypes } from 'react';
import secondaryAttributes from '../../utils/secondaryAttributes';

export default class AttributeCalc extends Component {

	static propTypes = {
		attributes: PropTypes.array.isRequired,
		baseValues: PropTypes.object.isRequired,
		phase: PropTypes.number.isRequired
	};

	render() {

		const { phase } = this.props;

		const calculated = secondaryAttributes();

		return (
			<div className="calculated">
				{
					calculated.map(attribute => (
						<AttributeCalcItem
							key={attribute.id}
							attribute={attribute}
							phase={phase}
							/>
					))
				}
			</div>
		);
	}
}
