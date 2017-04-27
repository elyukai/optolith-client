import classNames from 'classnames';
import * as React from 'react';
import * as CultureActions from '../../actions/CultureActions';
import { BorderButton } from '../../components/BorderButton';
import { get } from '../../stores/ListStore';
import { CultureInstance } from '../../types/data.d';

interface Props {
	currentID?: string;
	culture: CultureInstance;
	showDetails: boolean;
	changeTab(): void;
}

export class CulturesListItem extends React.Component<Props, undefined> {
	selectCulture = () => CultureActions.selectCulture(this.props.culture.id);

	render() {
		const { changeTab, currentID, culture, showDetails } = this.props;

		return (
			<li
				className={classNames({
					'active': culture.id === currentID,
				})}
				>
				<div className="left">
					<h2>{culture.name} (Kulturpaket: {culture.ap} AP)</h2>
					{
						showDetails ? (
							<div className="details">
								{
									culture.talents.map(talent => `${get(talent[0]).name} +${talent[1]}`).join(', ')
								}
							</div>
						) : null
					}
				</div>
				<div className="right">
					{
						culture.id === currentID ? (
							<BorderButton
								label="Weiter"
								onClick={changeTab}
								primary
								/>
						) : (
							<BorderButton
								label="Auswählen"
								onClick={this.selectCulture}
								/>
						)
					}
				</div>
			</li>
		);
	}
}
