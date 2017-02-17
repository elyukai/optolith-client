import * as React from 'react';
import Scroll from './Scroll';

interface Column {
	key: string;
	label: string;
}

interface Props {
	columns: Column[];
	iterator: (element: any) => JSX.Element;
	list: any[];
}

export default class TableList extends React.Component<Props, undefined> {
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
