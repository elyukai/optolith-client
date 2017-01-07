import InGameActions from '../../_actions/InGameActions';
import React, { Component } from 'react';
import classNames from 'classnames';

export default class InGameTableRight extends Component {

	static propTypes = {
		fighters: React.PropTypes.array.isRequired,
		options: React.PropTypes.object.isRequired
	};

	useEndurance = id => InGameActions.useEndurance(id);
	useAction = id => InGameActions.useAction(id);
	useFreeAction = id => InGameActions.useFreeAction(id);
	edit = id => InGameActions.edit(id);

	render() {
		return (
			<div className="ingame-table-right">
				<table>
					<thead>
						<tr>
							<td className="au">AU</td>
							<td className="a">A</td>
							<td className="fa">FA</td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{
							this.props.fighters.map((fighter) => {

								const className = classNames(fighter.deac && 'deac', fighter.type == 'f' && 'enemy');

								const actionsElement = fighter.cast > 0 ? (
									<td className="a">
										<div onClick={this.useAction.bind(null, fighter.id)}>
											({2 + fighter.aktm - fighter.aktv}/{fighter.cast})
										</div>
									</td>
								) : (
									<td className="a">
										<div onClick={this.useAction.bind(null, fighter.id)}>
											{2 + fighter.aktm - fighter.aktv}
										</div>
									</td>
								);

								return (
									<tr key={'igtr-' + fighter.id} className={className}>
										<td className="au">
											<div onClick={this.useEndurance.bind(null, fighter.id)}>
												{fighter.auc}
											</div>
										</td>
										{actionsElement}
										<td className="fa">
											<div onClick={this.useFreeAction.bind(null, fighter.id)}>
												{2 + fighter.faktm - fighter.faktv}
											</div>
										</td>
										<td className="edit">
											<div onClick={this.edit.bind(null, fighter.id)}>
												&#xE254;
											</div>
										</td>
									</tr>
								);
							})
						}
					</tbody>
				</table>
			</div>
		);
	}
}
