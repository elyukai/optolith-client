import * as React from 'react';
import ProgressArc = require('react-progress-arc');
import { AvatarWrapper } from '../../components/AvatarWrapper';
import { IconButton } from '../../components/IconButton';
import { ListItem } from '../../components/ListItem';
import { ListItemButtons } from '../../components/ListItemButtons';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { VerticalList } from '../../components/VerticalList';
import { DependentInstancesState } from '../../reducers/dependentInstances';
import { get } from '../../selectors/dependentInstancesSelectors';
import { ExperienceLevel, ProfessionInstance, User } from '../../types/data.d';
import { getExperienceLevelIdByAp, getHigherExperienceLevelId } from '../../utils/ELUtils';
import { getRoman } from '../../utils/NumberUtils';

export interface HerolistItemProps {
	currentHeroId?: string;
	dependent: DependentInstancesState;
	id?: string;
	name: string;
	ap: {
		spent: number;
		total: number;
	};
	avatar?: string;
	els: Map<string, ExperienceLevel>;
	c?: string;
	p?: string;
	player?: User;
	pv?: string;
	r?: string;
	professionName?: string;
	sex?: 'm' | 'f';
	loadHero(id?: string): void;
	saveHeroAsJSON(id?: string): void;
	showHero(): void;
	deleteHero(id?: string): void;
	duplicateHero(id?: string): void;
}

export function HerolistItem(props: HerolistItemProps) {
	const { player, id, currentHeroId, dependent, name, avatar, ap: { spent: apSpent, total: apTotal }, els, r, c, p, pv, sex, professionName, loadHero, saveHeroAsJSON, showHero, deleteHero, duplicateHero } = props;
	const elId = getExperienceLevelIdByAp(els, apTotal);
	const el = els.get(elId);
	const elnext = els.get(getHigherExperienceLevelId(elId));
	const elProgress = elnext === undefined || el === undefined ? 1 : ((apTotal - el.ap) / (elnext.ap - el.ap));
	const isOpen = id === currentHeroId;

	const rcpElement = id !== null && (
		<VerticalList className="rcp">
			<span className="race">
				{(() => {
					const { name } = r && get(dependent, r) || { name: '' };
					return name;
				})()}
			</span>
			<span className="culture">
				{(() => {
					const { name } = c && get(dependent, c) || { name: '' };
					return name;
				})()}
			</span>
			<span className="profession">
				{(() => {
					if (p === 'P_0') {
						return professionName;
					}
					let { name, subname } = p && get(dependent, p) as ProfessionInstance || { name: '', subname: undefined };
					if (typeof name === 'object' && sex) {
						name = name[sex];
					}
					if (typeof subname === 'object' && sex) {
						subname = subname[sex];
					}
					let { name: vname } = pv && get(dependent, pv) || { name: '' };
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
				<h2>{getRoman(Number.parseInt(elId.split(/_/)[1]))}</h2>
			</AvatarWrapper>
			<ListItemName name={name} addName={player && player.displayName} large>
				{rcpElement}
			</ListItemName>
			<ListItemSeparator/>
			<ListItemButtons>
				{id && <IconButton icon="&#xE14D;" onClick={duplicateHero} />}
				{id && <IconButton icon="&#xE80D;" onClick={saveHeroAsJSON} />}
				{id && <IconButton icon="&#xE872;" onClick={deleteHero} />}
				{(() => isOpen ? (
					<IconButton icon="&#xE89E;" onClick={showHero} />
				) : (
					<IconButton icon="&#xE5DD;" onClick={loadHero.bind(null, id)} />
				))()}
			</ListItemButtons>
		</ListItem>
	);
}
