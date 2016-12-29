import { Component, PropTypes } from 'react';
import * as React from 'react';
import RadioButtonGroup from './RadioButtonGroup';

const SORT_NAMES = {
	name: 'Alphabetisch',
	group: 'Nach Gruppe',
	groupname: 'Nach Gruppe',
	where: 'Nach Trageort'
};

interface Props {
	options: string[];
	sort: () => void;
	sortOrder: string;
}

export default class SortOptions extends Component<Props, any> {

	static propTypes = {
		options: PropTypes.array.isRequired,
		sort: PropTypes.func.isRequired,
		sortOrder: PropTypes.string.isRequired
	}

	render() {

		const { options, sort, sortOrder, ...other } = this.props;

		return (
			<RadioButtonGroup
				{...other}
				active={sortOrder}
				onClick={sort}
				array={options.map(e => ({ name: SORT_NAMES[e], value: e }))}
				/>
		);
	}
}
