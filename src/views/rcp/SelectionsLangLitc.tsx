import Checkbox from '../../components/Checkbox';
import Dropdown from '../../components/Dropdown';
import React, { Component, PropTypes } from 'react';

interface Props {
	active: Map<string, number>;
	apLeft: number;
	apTotal: number;
	change: (id: string, ap: number) => void;
	list: LanguagesScriptsSelectionListItem[];
}

export default class SelectionsLangLitc extends Component<Props, undefined> {
	render() {
		const { active, apTotal, apLeft, change, list } = this.props;
		const tiers = [{id:2,name:'I'},{id:4,name:'II'},{id:6,name:'III'}];

		return (
			<div className="lang_lit list">
				<h4>
					Sprachen und Schriften für insgesamt {apTotal} AP ({apLeft} AP übrig)
				</h4>
				{
					list.map(obj => {
						const { id, name, cost, disabled } = obj;
						return (
							<div key={id}>
								<Checkbox
									checked={active.has(id)}
									disabled={disabled || (!active.has(id) && (cost ? apLeft - cost < 0 : apLeft <= 0))}
									onClick={cost ? change.bind(null, id, cost) : change.bind(null, id, active.has(id) ? active.get(id) : 2)}>
									{name}{cost ? ` (Schrift, ${cost} AP)` : null}
								</Checkbox>
								{
									active.has(id) && !cost ? (
										<Dropdown
											className="tiers"
											value={active.get(id) || 0}
											onChange={change.bind(null, id)}
											options={tiers.filter(e => (e.id - (active.get(id) as number)) <= apLeft)} />
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
