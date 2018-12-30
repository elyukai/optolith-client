import * as React from 'react';
import { Dropdown, DropdownOption } from '../../components/Dropdown';
import { List, Maybe, Record } from '../../utils/dataUtils';
import { SpecialAbility } from '../../utils/wikiData/wikiTypeHelpers';

export interface TerrainKnowledgeProps {
  active: Maybe<number>;
  available: List<number>;
  terrainKnowledge: Record<SpecialAbility>;
  set (id: number): void;
}

export function TerrainKnowledge (props: TerrainKnowledgeProps) {
  const { active, available, terrainKnowledge, set } = props;

  return (
    <div className="terrain-knowledge">
      <h4>{terrainKnowledge .get ('name')}</h4>
      {Maybe.maybeToReactNode (
        terrainKnowledge .lookup ('select')
          .fmap (
            select => (
              <Dropdown
                value={active}
                options={
                  select .filter (
                    e => {
                      const id = e .get ('id');

                      return typeof id === 'number' && available .elem (id);
                    }
                  ) as List<Record<DropdownOption>>
                }
                onChangeJust={set}
                />
            )
          )
      )}
    </div>
  );
}
