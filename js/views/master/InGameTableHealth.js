import InGameTableHealthBar from './InGameTableHealthBar';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

class InGameTableHealth extends Component {
	
	static propTypes = {
		fighters: PropTypes.array.isRequired,
		options: PropTypes.object.isRequired
	};
	
	render() {
		return (
			<div className="ingame-table-health">
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

								const auElement = fighter.au > 0 ? (
									<InGameTableHealthBar type="au" current={fighter.auc} max={fighter.au} />
								) : null;
								
								const aeElement = fighter.ae > 0 ? (
									<InGameTableHealthBar type="ae" current={fighter.aec} max={fighter.ae} />
								) : null;
								
								const keElement = fighter.ke > 0 ? (
									<InGameTableHealthBar type="ke" current={fighter.kec} max={fighter.ke} />
								) : null;

								return (
									<tr key={'igtc-' + fighter.id} className={className}>
										<td>
											<InGameTableHealthBar type="le" current={fighter.lec} max={fighter.le} />
											{auElement}
											{aeElement}
											{keElement}
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

export default InGameTableHealth;
