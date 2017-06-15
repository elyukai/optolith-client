import * as React from 'react';
import ProgressArc = require('react-progress-arc');
import * as HerolistActions from '../../actions/HerolistActions';
import * as LocationActions from '../../actions/LocationActions';
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { VerticalList } from '../../components/VerticalList';
import { ELStore } from '../../stores/ELStore';
import { HerolistStore } from '../../stores/HerolistStore';
import { HistoryStore } from '../../stores/HistoryStore';
import { get } from '../../stores/ListStore';
import { ProfessionInstance, User } from '../../types/data.d';
import { calcElIdNumber } from '../../utils/calcEL';
import { confirm } from '../../utils/confirm';
import * as FileAPIUtils from '../../utils/FileAPIUtils';

export interface HerolistItemProps {
	id?: string;
	name: string;
	ap: {
		spent: number;
		total: number;
	};
	avatar?: string;
	c?: string;
	p?: string;
	player?: User;
	pv?: string;
	r?: string;
	professionName?: string;
	sex: 'm' | 'f';
}

export class HerolistItem extends React.Component<HerolistItemProps, {}> {

	load = () => {
		const id = this.props.id;
		const safeToLoad = ELStore.getStartID() === 'EL_0' || !HistoryStore.isUndoAvailable();
		if (id && safeToLoad) {
			HerolistActions.loadHero(id);
		}
		else if (id) {
			confirm('Ungespeicherte Aktionen', 'Beim aktuell geöffneten Helden sind einige Aktionen ungespeichert. Soll ohne Speichern fortgefahren werden?', true).then(result => {
				if (result === true) {
					HerolistActions.loadHero(id);
				}
				else {
					LocationActions.setSection('hero');
				}
			});
		}
	}
	show = () => LocationActions.setSection('hero');
	saveHeroAsJSON = () => {
		const id = this.props.id;
		const safeToSave = ELStore.getStartID() === 'EL_0' || !HistoryStore.isUndoAvailable();
		if (id && safeToSave) {
			FileAPIUtils.saveHero(id);
		}
		else if (id) {
			confirm('Ungespeicherte Aktionen', 'Beim aktuell geöffneten Helden sind einige Aktionen ungespeichert. Soll ohne Speichern fortgefahren werden?', true).then(result => {
				if (result === true) {
					FileAPIUtils.saveHero(id);
				}
				else {
					LocationActions.setSection('hero');
				}
			});
		}
	}
	delete = () => {
		const id = this.props.id;
		if (id) {
			confirm(`${this.props.name} löschen`, 'Soll der Held wirklich gelöscht werden? Die Aktion kann nich rückgängig gemacht werden!', true).then(result => {
				if (result === true) {
					HerolistActions.deleteHero(id);
				}
			});
		}
	}
	duplicate = () => {
		const id = this.props.id;
		if (id) {
			HerolistActions.duplicateHero(id);
		}
	}

	render() {
		const { player, id, name, avatar, ap: { spent: apSpent, total: apTotal }, r, c, p, pv, sex, professionName } = this.props;
		const elRoman = [ 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII' ];
		const elNumber = calcElIdNumber(apTotal);
		const el = ELStore.get(`EL_${elNumber}`);
		const elProgress = elNumber === 7 ? 1 : ((apTotal - el.ap) / (ELStore.get(`EL_${elNumber + 1}`).ap - el.ap));
		const isOpen = id === HerolistStore.getCurrentId();

		const rcpElement = id !== null && (
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
						if (p === 'P_0') {
							return professionName;
						}
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
				<span className="totalap">
					{apSpent} / {apTotal} AP
				</span>
			</VerticalList>
		);

		return (
			<ListItem>
				<ProgressArc completed={elProgress} diameter={63} strokeWidth={4} />
				<AvatarWrapper src={avatar}>
					<h2>{elRoman[elNumber - 1]}</h2>
				</AvatarWrapper>
				<ListItemName name={name} addName={player && player.displayName} large>
					{rcpElement}
				</ListItemName>
				<ListItemSeparator/>
				<ListItemButtons>
					{id && <IconButton icon="&#xE14D;" onClick={this.duplicate} />}
					{id && <IconButton icon="&#xE80D;" onClick={this.saveHeroAsJSON} />}
					{id && <IconButton icon="&#xE872;" onClick={this.delete} />}
					{(() => isOpen ? (
						<IconButton icon="&#xE89E;" onClick={this.show} />
					) : (
						<IconButton icon="&#xE5DD;" onClick={this.load} />
					))()}
				</ListItemButtons>
			</ListItem>
		);
	}
}
