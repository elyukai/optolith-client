import * as React from 'react';
import AttributeListItem from './AttributeListItem';

interface Props {
	attributes: AttributeInstance[];
	max: number;
	phase: number;
	sumMax: boolean;
}

export default class AttributeList extends React.Component<Props, undefined> {
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
