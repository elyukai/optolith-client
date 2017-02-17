import { get } from '../../stores/ListStore';
import * as HerolistActions from '../../actions/HerolistActions';
import * as LocationActions from '../../actions/LocationActions';
import * as React from 'react';
import Avatar from '../../components/Avatar';
import classNames from 'classnames';
import IconButton from '../../components/IconButton';
import ProfileStore from '../../stores/ProfileStore';
import ProgressArc from 'react-progress-arc';
import VerticalList from '../../components/VerticalList';

interface Props {
	id: string | null;
	name: string;
	ap: {
		total: number;
	};
	avatar: string;
	c: string | null;
	p: string | null;
	player?: User;
	pv: string | null;
	r: string | null;
	sex: 'm' | 'f';
}

export default class HerolistItem extends React.Component<Props, undefined> {

	load = () => this.props.id && HerolistActions.requestHero(this.props.id);
	show = () => LocationActions.setSection('hero');

	render() {

		const { player, id, name, avatar, ap: { total: apTotal }, r, c, p, pv, sex } = this.props;

		const isOpen = id === ProfileStore.getID();

		const elRoman = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII' ];
		const elAp = [ 900, 1000, 1100, 1200, 1400, 1700, 2100 ];

		let currentEL = 6;

		for (let i = 0; i < elAp.length; i++) {
			if (elAp[i] === apTotal) {
				currentEL = i;
				break;
			} else if (elAp[i] > apTotal) {
				currentEL = i - 1;
				break;
			}
		}

		const elProgress = currentEL === 6 ? 1 : ((apTotal - elAp[currentEL]) / (elAp[currentEL + 1] - elAp[currentEL]));

		const playerElement = player ? (
			<span className="player">{player.displayName}</span>
		) : null;

		const rcpElement = id !== null ? (
			<VerticalList className="rcp">
				<span className="race">
					{(() => {
						const { name } = r && get(r) || { name: '' };
						return name;
					})()}
				</span>
				<span className="culture">
					{(() => {
						const { name } = c && get(c) || { name: '' };
						return name;
					})()}
				</span>
				<span className="profession">
					{(() => {
						let { name, subname } = p && get(p) as ProfessionInstance || { name: '', subname: undefined };
						if (typeof name === 'object' && sex) {
							name = name[sex];
						}
						if (typeof subname === 'object' && sex) {
							subname = subname[sex];
						}
						let { name: vname } = pv && get(pv) || { name: '' };
						if (typeof vname === 'object' && sex) {
							vname = vname[sex];
						}
						return name + (subname ? ` (${subname})` : pv ? ` (${vname})` : '');
					})()}
				</span>
			</VerticalList>
		) : null;

		return (
			<li className="hero-list-item">
				<ProgressArc completed={elProgress} diameter={63} strokeWidth={4} />
				<div className={classNames( 'el avatar-wrapper', !avatar && 'no-avatar' )}>
					<div className="el-value">
						<h2>{elRoman[currentEL]}</h2>
					</div>
					<Avatar src={avatar} />
				</div>
				<div className="main">
					<h2><span className="name">{name}</span>{playerElement}</h2>
					{rcpElement}
				</div>
				{(() => isOpen ? (
					<IconButton icon="&#xE89E;" onClick={this.show} />
				) : (
					<IconButton icon="&#xE5DD;" onClick={this.load} />
				))()}
			</li>
		);
	}
}
