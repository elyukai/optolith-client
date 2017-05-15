import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { translate } from '../../utils/I18n';

interface Props {
	active: Set<string>;
	change: (id: string) => void;
	list: {
		id: string;
		name: string;
	}[];
	num: number;
}

export class SelectionsCantrips extends React.Component<Props, undefined> {
	render() {
		const nums = [translate('rcpselections.labels.onecantrip'), translate('rcpselections.labels.twocantrips')];

		const { active, change, list, num } = this.props;

		return (
			<div className="cantrips list">
				<h4>{nums[num - 1]} {translate('rcpselections.labels.fromthefollowinglist')}</h4>
				{
					list.map(obj => {
						const { id, name } = obj;
						return (
							<Checkbox
								key={id}
								checked={active.has(id)}
								disabled={!active.has(id) && active.size >= num}
								label={name}
								onClick={change.bind(null, id)} />
						);
					})
				}
			</div>
		);
	}
}
