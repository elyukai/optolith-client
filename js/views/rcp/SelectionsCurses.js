import BorderButton from '../../components/BorderButton';
import Checkbox from '../../components/Checkbox';
import React, { Component, PropTypes } from 'react';

class SelectionsCurses extends Component {

	static propTypes = {
		active: PropTypes.object,
		apTotal: PropTypes.number,
		apLeft: PropTypes.number,
		change: PropTypes.func,
		list: PropTypes.array
	};

	render() {

		const { active, apTotal, apLeft, change, list } = this.props;

		return (
			<div className="curses list">
				<h4>Flüche für insgesamt {apTotal} AP ({apLeft} AP übrig)</h4>
				{
					list.map(obj => {
						let { id, name } = obj;
						return (
							<div key={id}>
								<Checkbox
									checked={active.has(id)}
									disabled={!active.has(id) && apLeft <= 0}
									onClick={change.bind(null, id)}>
									{name} 
								</Checkbox>
								{active.has(id) ? <span>{active.get(id)}</span> : null}
								<BorderButton
									label="+"
									disabled={!active.has(id) || apLeft <= 0}
									onClick={change.bind(null, id, 'add')}/>
								<BorderButton
									label="-"
									disabled={!active.has(id) || active.get(id) <= 0}
									onClick={change.bind(null, id, 'remove')}/>
							</div>
						);
					})
				}
			</div>
		);
	}
}

export default SelectionsCurses;
