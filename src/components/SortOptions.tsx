import * as React from 'react';
import RadioButtonGroup from './RadioButtonGroup';

const SORT_NAMES = {
	name: 'Alphabetisch',
	group: 'Nach Gruppe',
	groupname: 'Nach Gruppe',
	where: 'Nach Trageort'
};

type SortNames = 'name' | 'group' | 'groupname' | 'where';

interface Props {
	options: SortNames[];
	sort: (option: string) => void;
	sortOrder: string;
}

export default class SortOptions extends React.Component<Props, undefined> {
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
