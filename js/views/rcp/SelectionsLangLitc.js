import Checkbox from '../../components/Checkbox';
import Dropdown from '../../components/Dropdown';
import React, { Component, PropTypes } from 'react';

export default class SelectionsLangLitc extends Component {

	static propTypes = {
		active: PropTypes.object,
		apLeft: PropTypes.number,
		apTotal: PropTypes.number,
		change: PropTypes.func,
		list: PropTypes.array
	};

	render() {

		const { active, apTotal, apLeft, change, list } = this.props;

		return (
			<div className="lang_lit list">
				<h4>
					Sprachen und Schriften für insgesamt {apTotal} AP ({apLeft} AP übrig)
				</h4>
				{
					list.map(obj => {
						let { id, name, ap, disabled } = obj;
						return (
							<div key={id}>
								<Checkbox
									checked={active.has(id)}
									disabled={disabled || (!active.has(id) && (ap ? apLeft - ap < 0 : apLeft <= 0))}
									onClick={ap ? change.bind(null, id, ap) : change.bind(null, id, active.has(id) ? active.get(id) : 2)}>
									{name}{ap ? ` (Schrift, ${ap} AP)` : null}
								</Checkbox>
								{
									active.has(id) && !ap ? (
										<Dropdown
											className="tiers"
											value={active.get(id)}
											onChange={change.bind(null, id)}
											options={[['I',2],['II',4],['III',6]].filter(e => (e[1] - active.get(id)) <= apLeft)} />
									) : null
								}
								
							</div>
						);
					})
				}
			</div>
		);
	}
}
