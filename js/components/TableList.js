import React, { Component, PropTypes } from 'react';
import Scroll from './Scroll';

export default class extends Component {

	static propTypes = {
		columns: PropTypes.array.isRequired,
		iterator: PropTypes.func.isRequired,
		list: PropTypes.array.isRequired
	};

	render() {

		const { columns, iterator, list } = this.props;

		return (
			<Scroll>
				<table>
					<thead>
						<tr>
							{
								columns.map(col => {
									const { key, label } = col;
									return <td className={'column-' + key}>{label}</td>;
								})
							}
							<td className="inc"></td>
						</tr>
					</thead>
					<tbody>
						{
							list.map(iterator)
						}
					</tbody>
				</table>
			</Scroll>
		);
	}
}
