import classNames from 'classnames';
import * as React from 'react';
import ProgressArc from 'react-progress-arc';
import * as HerolistActions from '../../actions/HerolistActions';
import * as LocationActions from '../../actions/LocationActions';
import AvatarWrapper from '../../components/AvatarWrapper';
import IconButton from '../../components/IconButton';
import VerticalList from '../../components/VerticalList';
import ELStore from '../../stores/ELStore';
import HerolistStore from '../../stores/HerolistStore';
import HistoryStore from '../../stores/HistoryStore';
import { get } from '../../stores/ListStore';
import ProfileStore from '../../stores/ProfileStore';
import confirm from '../../utils/confirm';
import * as FileAPIUtils from '../../utils/FileAPIUtils';

interface Props {
	indexId: string | null;
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

	load = () => {
		const indexId = this.props.indexId;
		const safeToLoad = ELStore.getStartID() === 'EL_0' || !HistoryStore.isUndoAvailable();
		if (indexId && safeToLoad) {
			HerolistActions.loadHero(indexId);
		}
		else if (indexId) {
			confirm('Ungespeicherte Aktionen', 'Beim aktuell geöffneten Helden sind einige Aktionen ungespeichert. Soll ohne Speichern fortgefahren werden?', true).then(result => {
				if (result === true) {
					HerolistActions.loadHero(indexId);
				}
				else {
					LocationActions.setSection('hero');
				}
			});
		}
	}
	show = () => LocationActions.setSection('hero');
	saveHeroAsJSON = () => {
		const indexId = this.props.indexId;
		const safeToSave = ELStore.getStartID() === 'EL_0' || !HistoryStore.isUndoAvailable();
		if (indexId && safeToSave) {
			FileAPIUtils.saveHero(indexId);
		}
		else if (indexId) {
			confirm('Ungespeicherte Aktionen', 'Beim aktuell geöffneten Helden sind einige Aktionen ungespeichert. Soll ohne Speichern fortgefahren werden?', true).then(result => {
				if (result === true) {
					FileAPIUtils.saveHero(indexId);
				}
				else {
					LocationActions.setSection('hero');
				}
			});
		}
	}
	delete = () => {
		const indexId = this.props.indexId;
		if (indexId) {
			confirm(`${this.props.name} löschen`, 'Soll der Held wirklich gelöscht werden? Die Aktion kann nich rückgängig gemacht werden!', true).then(result => {
				if (result === true) {
					HerolistActions.deleteHero(indexId);
				}
			});
		}
	}

	render() {
		const { player, indexId, name, avatar, ap: { total: apTotal }, r, c, p, pv, sex } = this.props;

		const isOpen = indexId === HerolistStore.getCurrent().indexId;

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

		const rcpElement = indexId !== null ? (
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
				<AvatarWrapper className="el" src={avatar}>
					<div className="el-value">
						<h2>{elRoman[currentEL]}</h2>
					</div>
				</AvatarWrapper>
				<div className="main">
					<h2><span className="name">{name}</span>{playerElement}</h2>
					{rcpElement}
				</div>
				<div className="buttons">
					{indexId && <IconButton icon="&#xE80D;" onClick={this.saveHeroAsJSON} />}
					{indexId && <IconButton icon="&#xE872;" onClick={this.delete} />}
					{(() => isOpen ? (
						<IconButton icon="&#xE89E;" onClick={this.show} />
					) : (
						<IconButton icon="&#xE5DD;" onClick={this.load} />
					))()}
				</div>
			</li>
		);
	}
}
