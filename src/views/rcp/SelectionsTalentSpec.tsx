import * as React from 'react';
import Dropdown from '../../components/Dropdown';
import TextField from '../../components/TextField';

interface Props {
	active: [number | null, string];
	change: (index: number, result: number | React.MouseEvent<string>) => void;
	input: string | null;
	list: { id: number; name: string; }[];
	name: string;
}

export default class SelectionsTalentSpec extends React.Component<Props, undefined> {
	render() {
		const { active, change, input, list, name } = this.props;

		return (
			<div className="spec">
				<h4>
					Anwendungsgebiet für Fertigkeitsspezialisierung ({name})
				</h4>
				<div>
					{
						list.length > 0 ? (
							<Dropdown
								className="tiers"
								value={active[0] || 0}
								onChange={change.bind(null, 0)}
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
								onChange={change.bind(null, 1)}
								disabled={input === null}
								/>
						) : null
					}
				</div>
			</div>
		);
	}
}

