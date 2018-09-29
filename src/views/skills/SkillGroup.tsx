import * as React from 'react';
import { ListItemGroup } from '../../components/ListItemGroup';
import { List } from '../../utils/dataUtils';

export interface SkillListItemProps {
  addText?: string;
  groupList?: List<string>;
  groupIndex?: number;
}

export function SkillGroup (props: SkillListItemProps) {
  const {
    addText,
    groupIndex,
    groupList,
  } = props;

  if (addText || groupIndex && groupList) {
    return (
      <ListItemGroup index={groupIndex} list={groupList} text={addText}/>
    );
  }

  return null;
}
