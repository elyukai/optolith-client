import Checkbox from '../../layout/Checkbox';
import React, { Component, PropTypes } from 'react';

class SelectionsCt extends Component {

	static propTypes = {
		active: PropTypes.object,
		amount: PropTypes.number,
		change: PropTypes.func,
		list: PropTypes.array,
		num: PropTypes.number
	};

	constructor(props) {
		super(props);
	}

	render() {
		
		const nums = ['Eine', 'Zwei'];

		const { active, amount, change, list, num } = this.props;

		return (
			<div className="ct list">
				<h4>{nums[num - 1]} der folgenden Kampftechniken {6 + amount}</h4>
				{
					list.map(obj => {
						let { id, name } = obj;
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

export default SelectionsCt;
