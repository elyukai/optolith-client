import classNames from 'classnames';
import * as React from 'react';
import * as CultureActions from '../../actions/CultureActions';
import { BorderButton } from '../../components/BorderButton';
import { get } from '../../stores/ListStore';
import { CultureInstance } from '../../types/data.d';
import { translate } from '../../utils/I18n';

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
					<h2>{culture.name} ({culture.ap} AP)</h2>
					{
						showDetails && (
							<div className="details">
								{
									culture.talents.map(talent => `${get(talent[0]).name} +${talent[1]}`).sort().join(', ')
								}
							</div>
						)
					}
				</div>
				<div className="right">
					{
						culture.id === currentID ? (
							<BorderButton
								label={translate('rcp.actions.next')}
								onClick={changeTab}
								primary
								/>
						) : (
							<BorderButton
								label={translate('rcp.actions.select')}
								onClick={this.selectCulture}
								/>
						)
					}
				</div>
			</li>
		);
	}
}
