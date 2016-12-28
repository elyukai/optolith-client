import AttributeStore from '../../stores/AttributeStore';
import classNames from 'classnames';
import React, { Component, PropTypes } from 'react';
import TextBox from '../../components/TextBox';

export default class AttributeCheckMods extends Component {

	render() {

		const attributes = AttributeStore.getAll();

		return (
			<TextBox className="attribute-check-mods" label="Eigenschaftsmodifikationen">
				<table>
					<thead>
						<tr>
							<td className="name"></td>
							<td>-3</td>
							<td>-2</td>
							<td>-1</td>
							<td className="null">0</td>
							<td>+1</td>
							<td>+2</td>
							<td>+3</td>
						</tr>
					</thead>
					<tbody>
						{attributes.map(obj => {
							const { id, short, value } = obj;
							return (<tr key={id} className={id}>
								<td className="name">{short}</td>
								<td>{value - 3}</td>
								<td>{value - 2}</td>
								<td>{value - 1}</td>
								<td className="null">{value}</td>
								<td>{value + 1}</td>
								<td>{value + 2}</td>
								<td>{value + 3}</td>
							</tr>);
						})}
					</tbody>
				</table>
			</TextBox>
		);
	}
}
