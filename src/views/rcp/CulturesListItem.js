import BorderButton from '../../components/BorderButton';
import CultureActions from '../../actions/CultureActions';
import { Culture } from '../../utils/DataUtils';
import { get } from '../../stores/ListStore';
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';

export default class CulturesListItem extends Component {

	static propTypes = {
		changeTab: PropTypes.func.isRequired,
		culture: PropTypes.instanceOf(Culture).isRequired,
		currentID: PropTypes.string,
		showDetails: PropTypes.bool.isRequired
	};

	selectCulture = () => CultureActions.selectCulture(this.props.culture.id);

	render() {

		const { changeTab, currentID, culture, showDetails } = this.props;

		const className = classNames({
			'active': culture.id === currentID
		});

		return (
			<li className={className}>
				<div className="left">
					<h2>{culture.name} ({culture.ap} AP)</h2>
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
