import { Component, PropTypes } from 'react';
import * as React from 'react';
import Scroll from './Scroll';

interface Column {
	key: string;
	label: string
}

interface Props {
	columns: Column[];
	iterator: (element: any) => JSX.Element;
	list: any[];
}

export default class extends Component<Props, any> {

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
