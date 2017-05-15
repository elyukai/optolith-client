import * as React from 'react';
import { BorderButton } from '../../components/BorderButton';
import { Checkbox } from '../../components/Checkbox';
import { translate } from '../../utils/I18n';

interface Props {
	active: Map<string, number>;
	apLeft: number;
	apTotal: number;
	change: (id: string, operation: string) => void;
	list: {
		id: string;
		name: string;
	}[];
}

export class SelectionsCurses extends React.Component<Props, undefined> {
	render() {
		const { active, apTotal, apLeft, change, list } = this.props;

		return (
			<div className="curses list">
				<h4>{translate('rcpselections.labels.cursestotaling')} {apTotal} AP ({apLeft} AP {translate('rcpselections.labels.left')})</h4>
				{
					list.map(obj => {
						const { id, name } = obj;
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
									disabled={!active.has(id) || active.get(id)! <= 0}
									onClick={change.bind(null, id, 'remove')}/>
							</div>
						);
					})
				}
			</div>
		);
	}
}
