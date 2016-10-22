import Avatar from '../../layout/Avatar';
import BorderButton from '../../layout/BorderButton';
import CultureStore from '../../../stores/rcp/CultureStore';
import HerolistActions from '../../../actions/HerolistActions';
import ProfessionStore from '../../../stores/rcp/ProfessionStore';
import ProfessionVariantStore from '../../../stores/rcp/ProfessionVariantStore';
import ProfileStore from '../../../stores/ProfileStore';
import ProgressArc from 'react-progress-arc';
import RaceStore from '../../../stores/rcp/RaceStore';
import React, { PropTypes, Component } from 'react';
import TabActions from '../../../actions/TabActions';
import classNames from 'classnames';

class HerolistItem extends Component {

	static propTypes = {
		id: PropTypes.string,
		name: PropTypes.string,
		avatar: PropTypes.string,
		ap: PropTypes.object,
		el: PropTypes.string,
		r: PropTypes.string,
		c: PropTypes.string,
		p: PropTypes.string,
		pv: PropTypes.string
	};

	constructor(props) {
		super(props);
	}

	load = () => HerolistActions.load(this.props.id);
	show = () => TabActions.showSection('hero');

	render() {

		const { id, name, avatar, ap, r, c, p, pv } = this.props;
		const { _max: apTotal } = ap;

		const elRoman = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII' ];
		const elAp = [ 900, 1000, 1100, 1200, 1400, 1700, 2100 ];

		var currentEL = 6;

		for (let i = 0; i < elAp.length; i++) {
			if (elAp[i] === apTotal) {
				currentEL = i;
				break;
			} else if (elAp[i] > apTotal) {
				currentEL = i - 1;
				break;
			}
		}

		var elProgress = currentEL === 6 ? 1 : ((apTotal - elAp[currentEL]) / (elAp[currentEL + 1] - elAp[currentEL]));

		return (
			<li className="hero-list-item">
				<ProgressArc completed={elProgress} diameter={63} strokeWidth={4} />
				<div className={classNames( 'el avatar-wrapper', !avatar && 'no-avatar' )}>
					<div className="overlay">
						<h2>{elRoman[currentEL]}</h2>
					</div>
					<Avatar src={avatar} />
				</div>
				<div className="main">
					<h2>{name}</h2>
					<div className="rcp">
						{ do {
							if (id === null) {
								null;
							} else {
								RaceStore.getNameByID(r) + ' • ' + CultureStore.getNameByID(c) + ' • ' + ProfessionStore.getNameByID(p) + (pv ? ` (${ProfessionVariantStore.getNameByID(pv)})` : '');
							}
						}}
					</div>
				</div>
				{ do {
					if (id === ProfileStore.getID()) {
						<BorderButton label="Anzeigen" onClick={this.show} primary />;
					} else {
						<BorderButton label="Öffnen" onClick={this.load} />;
					}
				}}
			</li>
		);
	}
}

export default HerolistItem;
