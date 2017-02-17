import * as React from 'react';
import Dropdown from '../../components/Dropdown';
import TextField from '../../components/TextField';

interface Props {
	active: [number | null, string];
	change: (value: string | number) => void;
	input: string | null;
	list: { id: number; name: string; }[] | null;
	name: string;
}

export default class SelectionsTalentSpec extends React.Component<Props, undefined> {
	render() {
		const { active, change, input, list, name } = this.props;

		const changeMiddleware = (event: InputTextEvent) => change(event.target.value);

		return (
			<div className="spec">
				<h4>
					Anwendungsgebiet für Fertigkeitsspezialisierung ({name})
				</h4>
				<div>
					{
						list ? (
							<Dropdown
								className="tiers"
								value={active[0] || 0}
								onChange={change}
								options={list}
								disabled={active[1] !== ''}
								/>
						) : null
					}
					{
						input !== null ? (
							<TextField
								hint={input}
								value={active[1]}
								onChange={changeMiddleware}
								disabled={input === null}
								/>
						) : null
					}
				</div>
			</div>
		);
	}
}

