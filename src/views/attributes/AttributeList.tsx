import AttributeListItem from './AttributeListItem';
import * as React from 'react';

interface Props {
	attributes: Attribute[];
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
