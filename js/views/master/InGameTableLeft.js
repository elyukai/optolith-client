import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class InGameTableLeft extends Component {
	
	static propTypes = {
		fighters: PropTypes.array.isRequired,
		options: PropTypes.object.isRequired
	};
	
	render() {
		return (
			<div className="ingame-table-left">
				<table>
					<thead>
						<tr>
							<td className="ib">IB</td>
							<td className="init">INI</td>
							<td></td>
						</tr>
					</thead>
					<tbody>
						{
							this.props.fighters.map((fighter) => {
								
								const className = classNames('type-' + fighter.type, fighter.deac && 'deac', fighter.type == 'f' && 'enemy');
								
								return (
									<tr key={'igtl-' + fighter.id} className={className}>
										<td className="ib">
											{fighter.ib}
										</td>
										<td className="avatar">
											<div className="avatar-outer">
												<div className="avatar-inner">
													<span className="init">{fighter.init}</span>
													<img src="" alt=""></img>
												</div>
											</div>
										</td>
										<td className="name">
											{fighter.name}
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
