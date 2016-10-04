import Avatar from '../../layout/Avatar';
import BorderButton from '../../layout/BorderButton';
import CultureStore from '../../../stores/rcp/CultureStore';
import HerolistActions from '../../../actions/HerolistActions';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../../../stores/rcp/ProfessionVariantStore';
import ProgressArc from 'react-progress-arc';
import RaceStore from '../../../stores/rcp/RaceStore';
import React, { PropTypes, Component } from 'react';
import classNames from 'classnames';

class HerolistItem extends Component {

	static propTypes = {
		ap: PropTypes.number,
		apUsed: PropTypes.number,
		avatar: PropTypes.string,
		culture: PropTypes.string,
		name: PropTypes.string,
		profession: PropTypes.string,
		race: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	load = () => HerolistActions.load(this.props.id);

	render() {

		const { ap, apUsed, avatar, culture, name, profession, professionVariant, race } = this.props;

		const elRoman = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII' ];
		const elAp = [ 900, 1000, 1100, 1200, 1400, 1700, 2100 ];

		var currentEL = 6;

		for (let i = 0; i < elAp.length; i++) {
			if (elAp[i] >= ap) {
				currentEL = i - 1;
				break;
			}
		}

		var elProgress = currentEL === 6 ? 1 : ((ap - elAp[currentEL]) / (elAp[currentEL + 1] - elAp[currentEL]));

		return (
			<li className="hero-list-item">
				<ProgressArc completed={elProgress} diameter={63} strokeWidth={4} />
				<div className={classNames( 'el', !avatar && 'no-avatar' )}>
					<div className="overlay">
						<h2>{elRoman[currentEL]}</h2>
					</div>
					<Avatar src={avatar} />
				</div>
				<div className="main">
					<h2>{name}</h2>
					<div className="rcp">
						{RaceStore.getNameByID(race)} • {CultureStore.getNameByID(culture)} • {ProfessionStore.getNameByID(profession)}{professionVariant ? ` (${ProfessionVariantStore.getNameByID(professionVariant)})` : ''}
					</div>
				</div>
				<BorderButton label="Öffnen" onClick={this.load} />
			</li>
		);
	}
}

export default HerolistItem;
