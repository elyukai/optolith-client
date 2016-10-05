import Dropdown from '../../layout/Dropdown';
import React, { Component, PropTypes } from 'react';
import TextField from '../../layout/TextField';

class SelectionsTalentSpec extends Component {

	static propTypes = {
		active: PropTypes.array,
		change: PropTypes.func,
		input: PropTypes.string,
		list: PropTypes.array,
		name: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	render() {

		const { active, change, input, list, name } = this.props;

		return (
			<div className="spec">
				<h4>
					Gebiet für Fertigkeitsspezialisierung ({name})
				</h4>
				<div>
					{
						list.length > 0 ? (
							<Dropdown
								className="tiers"
								value={active[0]}
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

export default SelectionsTalentSpec;
