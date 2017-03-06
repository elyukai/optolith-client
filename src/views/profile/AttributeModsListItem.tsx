import * as React from 'react';

export default (props: AttributeInstance) => {
	const { id, short, value } = props;
	return (
		<tr className={id}>
			<td className="name">{short}</td>
			<td>{value - 3}</td>
			<td>{value - 2}</td>
			<td>{value - 1}</td>
			<td className="null">{value}</td>
			<td>{value + 1}</td>
			<td>{value + 2}</td>
			<td>{value + 3}</td>
		</tr>
	);
};
