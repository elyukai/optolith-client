import * as React from 'react';
import { List } from '../../components/List';
import { Advantage, Blessing, Cantrip, CombatTechnique, Culture, Disadvantage, ItemTemplate, LiturgicalChant, Profession, Race, Skill, SpecialAbility, Spell } from '../../types/wiki';
import { isProfession, isSpecialAbility } from '../../utils/WikiUtils';
import { WikiListItem } from './WikiListItem';

export interface WikiListProps {
	list: (Race | Culture | Profession | Advantage | Disadvantage | Skill | CombatTechnique | SpecialAbility | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate)[];
	sex?: 'm' | 'f';
	currentInfoId?: string;
	showInfo(id: string): void;
}

export class WikiList extends React.Component<WikiListProps> {
	shouldComponentUpdate(nextProps: WikiListProps) {
		return nextProps.list !== this.props.list || nextProps.sex !== this.props.sex || nextProps.currentInfoId !== this.props.currentInfoId;
	}

	render() {
		const { list, sex = 'm' } = this.props;

		return (
			<List>
				{
					list && list.map(item => {
						const { id } = item;
						let { name } = item;

						if (typeof name === 'object') {
							name = name[sex];
						}

						if (isProfession(item) && item.subname !== undefined) {
							if (typeof item.subname === 'object') {
								name += ` (${item.subname[sex]})`;
							}
							else {
								name += ` (${item.subname})`;
							}
						}
						else if (isSpecialAbility(item) && typeof item.nameInWiki === 'string') {
							name = item.nameInWiki;
						}

						return (
							<WikiListItem {...this.props} {...item} key={id} name={name} />
						);
					})
				}
			</List>
		);
	}
}
