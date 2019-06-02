import React, { Component, PropTypes } from 'react';
import { classNames } from 'classnames';

export class InGameTableIni extends Component {

	static propTypes = {
		fighters: PropTypes.array.isRequired,
		iniArray: PropTypes.array.isRequired,
		options: PropTypes.object.isRequired,
		status: PropTypes.array.isRequired,
		usedPhases: PropTypes.array.isRequired
	};

	render() {
		return (
			<div className="ingame-table-ini">
				<table>
					<thead>
						<tr>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{
							this.props.fighters.map(fighter => {

								const className = classNames(fighter.deac && 'deac', fighter.type == 'f' && 'enemy');

								const indicatorElement = this.props.status[1] == fighter.init || this.props.status[1] == fighter.init - 8 ? (
									<div className="indicator">{this.props.status[1] == fighter.init ? 1 : 2}</div>
								) : (
									<div></div>
								);

								return (
									<tr key={'igtc-' + fighter.id} className={className}>
										<td>
											{indicatorElement}
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
