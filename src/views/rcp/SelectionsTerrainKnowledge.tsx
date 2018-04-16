import * as React from 'react';
import { Dropdown } from '../../components/Dropdown';
import { SpecialAbility } from '../../types/wiki';

export interface TerrainKnowledgeProps {
	active?: number;
	available: number[];
	terrainKnowledge: SpecialAbility;
	set(id: number): void;
}

export function TerrainKnowledge(props: TerrainKnowledgeProps) {
	const { active, available, terrainKnowledge, set } = props;

	return (
		<div className="terrain-knowledge">
			<h4>{terrainKnowledge.name}</h4>
			<Dropdown
				value={active}
				options={terrainKnowledge.select!.filter(e => {
					return available.includes(e.id as number);
				})}
				onChange={set}
				/>
		</div>
	);
}
