import RadioButtonGroup from './RadioButtonGroup';
import React, { Component, PropTypes } from 'react';

const SORT_NAMES = {
	name: 'Alphabetisch',
	group: 'Nach Gruppe',
	groupname: 'Nach Gruppe',
	where: 'Nach Trageort'
};

export default class SortOptions extends Component {

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
