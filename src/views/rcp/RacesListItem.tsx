import classNames from 'classnames';
import * as React from 'react';
import * as RaceActions from '../../actions/RaceActions';
import BorderButton from '../../components/BorderButton';
import VerticalList from '../../components/VerticalList';

interface Props {
	currentID: string | null;
	race: RaceInstance;
	showDetails: boolean;
	changeTab(): void;
}

export default class RacesListItem extends React.Component<Props, undefined> {
	selectRace = () => RaceActions.selectRace(this.props.race.id);

	render() {

		const { changeTab, currentID, race, showDetails } = this.props;

		return (
			<li
				className={classNames({
					'active': race.id === currentID,
				})}
				>
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
