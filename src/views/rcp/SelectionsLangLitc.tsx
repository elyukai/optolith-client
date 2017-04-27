import classNames from 'classnames';
import * as React from 'react';
import { Checkbox } from '../../components/Checkbox';
import { Dropdown } from '../../components/Dropdown';
import { LanguagesSelectionListItem, ScriptsSelectionListItem } from '../../types/data.d';

interface Props {
	active: Map<string, number>;
	apLeft: number;
	apTotal: number;
	scripts: ScriptsSelectionListItem[];
	languages: LanguagesSelectionListItem[];
	change(id: string, ap: number): void;
}

export class SelectionsLangLitc extends React.Component<Props, undefined> {
	render() {
		const { active, apTotal, apLeft, change, scripts, languages } = this.props;
		const tiers = [{id: 2, name: 'I'}, {id: 4, name: 'II'}, {id: 6, name: 'III'}];

		return (
			<div className="lang_lit list">
				<h4>
					Sprachen und Schriften für insgesamt {apTotal} AP ({apLeft} AP übrig)
				</h4>
				<div className="languages-scripts">
					<div className="languages">
						{
							languages.map(obj => {
								const { id, name, native } = obj;
								const disabled = native || !active.has(id) && apLeft <= 0;
								return (
									<div key={id} className={classNames(disabled && 'disabled')}>
										<Checkbox
											checked={active.has(id) || native === true}
											disabled={disabled}
											onClick={change.bind(null, id, active.has(id) ? active.get(id) : 2)}>
											{name}
										</Checkbox>
										{(() => {
											if (native) {
												return (
													<Dropdown
														className="tiers"
														value={4}
														options={[{id: 4, name: 'MS'}]}
														disabled
														/>
												);
											}
											else if (active.has(id)) {
												return (
													<Dropdown
														className="tiers"
														value={active.get(id) || 0}
														onChange={change.bind(null, id)}
														options={tiers.filter(e => (e.id - active.get(id)!) <= apLeft)}
														/>
												);
											}
											return undefined;
										})()}
									</div>
								);
							})
						}
					</div>
					<div className="scripts">
						{
							scripts.map(obj => {
								const { id, name, cost, native } = obj;
								const disabled = native || !active.has(id) && apLeft - cost < 0;
								return (
									<div key={id} className={classNames(disabled && 'disabled')}>
										<Checkbox
											checked={active.has(id) || native === true}
											disabled={disabled}
											onClick={change.bind(null, id, cost)}>
											{name} ({cost} AP)
										</Checkbox>
									</div>
								);
							})
						}
					</div>
				</div>
			</div>
		);
	}
}
