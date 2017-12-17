import * as React from 'react';
import { List } from '../../components/List';
import { PROFESSIONS } from '../../constants/Categories';
import { AdvantageInstance, DisadvantageInstance, SpecialAbilityInstance } from '../../types/data';
import { Blessing, Cantrip, CombatTechnique, Culture, ItemTemplate, LiturgicalChant, Profession, Race, Skill, Spell } from '../../types/wiki';
import { WikiListItem } from './WikiListItem';

export interface WikiListProps {
	list: (Race | Culture | Profession | AdvantageInstance | DisadvantageInstance | Skill | CombatTechnique | SpecialAbilityInstance | Spell | Cantrip | LiturgicalChant | Blessing | ItemTemplate)[];
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
						let subname: string | undefined;

						if (typeof name === 'object') {
							name = name[sex];
						}

						// if (item.category === PROFESSIONS) {
						// 	if (typeof item.subname === 'object') {
						// 		subname = item.subname[sex];
						// 	}
						// 	else {
						// 		subname = item.subname;
						// 	}
						// }

						return (
							<WikiListItem {...this.props} {...item} key={id} name={name} subname={subname} />
						);
					})
				}
			</List>
		);
	}
}
