import * as classNames from 'classnames';
import * as React from 'react';
import * as RaceActions from '../../actions/RaceActions';
import { BorderButton } from '../../components/BorderButton';
import { VerticalList } from '../../components/VerticalList';
import { RaceInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';

interface Props {
	currentID?: string;
	race: RaceInstance;
	showDetails: boolean;
	changeTab(): void;
}

export class RacesListItem extends React.Component<Props, undefined> {
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
								<span>{translate('secondaryattributes.lp.short')} {race.lp}</span>
								<span>{translate('secondaryattributes.spi.short')} {race.spi}</span>
								<span>{translate('secondaryattributes.tou.short')} {race.tou}</span>
								<span>{translate('secondaryattributes.mov.short')} {race.mov}</span>
							</VerticalList>
						) : null
					}
				</div>
				<div className="right">
					{
						race.id === currentID ? (
							<BorderButton
								label={translate('rcp.actions.next')}
								onClick={changeTab}
								primary
								/>
						) : (
							<BorderButton
								label={translate('rcp.actions.select')}
								onClick={this.selectRace}
								/>
						)
					}
				</div>
			</li>
		);
	}
}
