import BorderButton from '../../components/BorderButton';
import { Race } from '../../utils/DataUtils';
import React, { Component, PropTypes } from 'react';
import RaceActions from '../../actions/RaceActions';
import VerticalList from '../../components/VerticalList';
import classNames from 'classnames';

export default class RacesListItem extends Component {

	static propTypes = {
		changeTab: PropTypes.func.isRequired,
		currentID: PropTypes.string,
		race: PropTypes.instanceOf(Race).isRequired,
		showDetails: PropTypes.bool.isRequired
	};

	selectRace = () => RaceActions.selectRace(this.props.race.id);

	render() {

		const { changeTab, currentID, race, showDetails } = this.props;

		const className = classNames({
			'active': race.id === currentID
		});

		return (
			<li className={className}>
				<div className="left">
					<h2>{race.name} ({race.ap} AP)</h2>
					{
						showDetails ? (
							<VerticalList className="details">
								<span>LE {race.lp}</span>
								<span>SK {race.spi}</span>
								<span>ZK {race.tou}</span>
								<span>GS {race.mov}</span>
							</VerticalList>
						) : null
					}
				</div>
				<div className="right">
					{
						race.id === currentID ? (
							<BorderButton
								label="Weiter"
								onClick={changeTab}
								primary
								/>
						) : (
							<BorderButton
								label="Auswählen"
								onClick={this.selectRace}
								/>
						)
					}
				</div>
			</li>
		);
	}
}
