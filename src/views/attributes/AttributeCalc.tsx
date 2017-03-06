import * as React from 'react';
import secondaryAttributes from '../../utils/secondaryAttributes';
import AttributeCalcItem from './AttributeCalcItem';

interface Props {
	phase: number;
}

export default class AttributeCalc extends React.Component<Props, undefined> {
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
