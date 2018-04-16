import * as React from 'react';
import { ListItem } from '../../components/ListItem';
import { ListItemName } from '../../components/ListItemName';
import { ListItemSeparator } from '../../components/ListItemSeparator';
import { ListItemValues } from '../../components/ListItemValues';
import { DCIds } from '../../selectors/derivedCharacteristicsSelectors';
import { AttributeInstance, SecondaryAttribute } from '../../types/data.d';
import { AdditionalValue, SkillAdditionalValues } from './SkillAdditionalValues';
import { SkillButtons } from './SkillButtons';
import { SkillCheck } from './SkillCheck';
import { SkillFill } from './SkillFill';
import { SkillGroup } from './SkillGroup';
import { SkillImprovementCost } from './SkillImprovementCost';
import { SkillRating } from './SkillRating';

export interface SkillListItemProps {
  attributes: Map<string, AttributeInstance>;
  activateDisabled?: boolean;
  addDisabled?: boolean;
  addFillElement?: boolean;
  addValues?: AdditionalValue[];
  addText?: string;
  check?: string[];
  checkDisabled?: boolean;
  checkmod?: 'SPI' | 'TOU';
  derivedCharacteristics?: Map<DCIds, SecondaryAttribute>;
  groupList?: string[];
  groupIndex?: number;
  ic?: number;
  id: string;
  insertTopMargin?: boolean;
  isNotActive?: boolean;
  name: string;
  noIncrease?: boolean;
  removeDisabled?: boolean;
  sr?: number;
  typ?: boolean;
  untyp?: boolean;
  activate?(): void;
  addPoint?(): void;
  removePoint?(): void;
  selectForInfo(id: string): void;
}

export class SkillListItem extends React.Component<SkillListItemProps> {
  shouldComponentUpdate(nextProps: SkillListItemProps) {
    return this.props.sr !== nextProps.sr ||
      this.props.addText !== nextProps.addText ||
      this.props.activateDisabled !== nextProps.activateDisabled ||
      this.props.attributes !== nextProps.attributes ||
      this.props.derivedCharacteristics !== nextProps.derivedCharacteristics ||
      this.props.insertTopMargin !== nextProps.insertTopMargin ||
      this.props.typ !== nextProps.typ ||
      this.props.untyp !== nextProps.untyp;
  }

  render() {
    const {
      insertTopMargin,
      name,
      noIncrease,
      typ,
      untyp,
    } = this.props;

    return (
      <ListItem
        noIncrease={noIncrease}
        recommended={typ}
        unrecommended={untyp}
        insertTopMargin={insertTopMargin}
        >
        <ListItemName name={name} />
        <ListItemSeparator />
        <SkillGroup {...this.props} />
        <ListItemValues>
          <SkillRating {...this.props} />
          <SkillCheck {...this.props} />
          <SkillFill {...this.props} />
          <SkillImprovementCost {...this.props} />
          <SkillAdditionalValues {...this.props} />
        </ListItemValues>
        <SkillButtons {...this.props}  />
      </ListItem>
    );
  }
}
