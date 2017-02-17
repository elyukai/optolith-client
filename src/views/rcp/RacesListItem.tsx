import * as RaceActions from '../../actions/RaceActions';
import * as React from 'react';
import BorderButton from '../../components/BorderButton';
import classNames from 'classnames';
import VerticalList from '../../components/VerticalList';

interface Props {
	changeTab: (tab: string) => void;
	currentID: string | null;
	race: RaceInstance;
	showDetails: boolean;
}

export default class RacesListItem extends React.Component<Props, undefined> {
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
