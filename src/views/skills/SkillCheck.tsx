import { get } from '../../stores/ListStore';
import * as React from 'react';

interface Props {
	check: string[];
	mod?: string;
}

export default class SkillListItem extends React.Component<Props, undefined> {
	render() {
		const { check, mod } = this.props;

		return (
			<div className="check">
				{check.map((attr, index) => (
					<div key={attr + index} className={attr}>{(get(attr) as AttributeInstance).short}</div>
				))}
				{mod ? <div key="mod" className="check mod">+{mod}</div> : null}
			</div>
		);
	}
}
