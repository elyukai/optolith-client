import { PetEditorInstance, PetInstance } from '../types/data.d';
import { Record, RecordSafeKeys } from './dataUtils';

export const convertToEdit = (item: Record<PetInstance>): Record<PetEditorInstance> =>
  item.merge(Record.of({
    size: item.lookupWithDefault('', 'size'),
    type: item.lookupWithDefault('', 'type'),
    attack: item.lookupWithDefault('', 'attack'),
    dp: item.lookupWithDefault('', 'dp'),
    reach: item.lookupWithDefault('', 'reach'),
    actions: item.lookupWithDefault('', 'actions'),
    talents: item.lookupWithDefault('', 'talents'),
    skills: item.lookupWithDefault('', 'skills'),
    notes: item.lookupWithDefault('', 'notes'),
    spentAp: item.lookupWithDefault('', 'spentAp'),
    totalAp: item.lookupWithDefault('', 'totalAp'),
    cou: item.lookupWithDefault('', 'cou'),
    sgc: item.lookupWithDefault('', 'sgc'),
    int: item.lookupWithDefault('', 'int'),
    cha: item.lookupWithDefault('', 'cha'),
    dex: item.lookupWithDefault('', 'dex'),
    agi: item.lookupWithDefault('', 'agi'),
    con: item.lookupWithDefault('', 'con'),
    str: item.lookupWithDefault('', 'str'),
    lp: item.lookupWithDefault('', 'lp'),
    ae: item.lookupWithDefault('', 'ae'),
    spi: item.lookupWithDefault('', 'spi'),
    tou: item.lookupWithDefault('', 'tou'),
    pro: item.lookupWithDefault('', 'pro'),
    ini: item.lookupWithDefault('', 'ini'),
    mov: item.lookupWithDefault('', 'mov'),
    at: item.lookupWithDefault('', 'at'),
    pa: item.lookupWithDefault('', 'pa'),
  }));

export const getNewInstance = (): Record<PetEditorInstance> =>
  Record.of<PetEditorInstance>({
    name: '',
    size: '',
    type: '',
    avatar: '',
    attack: '',
    dp: '',
    reach: '',
    actions: '',
    talents: '',
    skills: '',
    spentAp: '',
    totalAp: '',
    cou: '',
    sgc: '',
    int: '',
    cha: '',
    dex: '',
    agi: '',
    con: '',
    str: '',
    lp: '',
    ae: '',
    spi: '',
    tou: '',
    pro: '',
    ini: '',
    mov: '',
    at: '',
    pa: '',
    notes: ''
  });

const getNonEmptyStringOr = <T extends { [key: string]: any }>(
  record: Record<T>,
  key: RecordSafeKeys<T>
): string | undefined =>
  record.get(key).length > 0 ? record.get(key) : undefined

export const convertToSave = (item: Record<PetEditorInstance>): Record<PetInstance> => {
  return item.merge(Record.of({
    size: getNonEmptyStringOr(item, 'size'),
    type: getNonEmptyStringOr(item, 'type'),
    attack: getNonEmptyStringOr(item, 'attack'),
    dp: getNonEmptyStringOr(item, 'dp'),
    reach: getNonEmptyStringOr(item, 'reach'),
    actions: getNonEmptyStringOr(item, 'actions'),
    talents: getNonEmptyStringOr(item, 'talents'),
    skills: getNonEmptyStringOr(item, 'skills'),
    notes: getNonEmptyStringOr(item, 'notes'),
    spentAp: getNonEmptyStringOr(item, 'spentAp'),
    totalAp: getNonEmptyStringOr(item, 'totalAp'),
    cou: getNonEmptyStringOr(item, 'cou'),
    sgc: getNonEmptyStringOr(item, 'sgc'),
    int: getNonEmptyStringOr(item, 'int'),
    cha: getNonEmptyStringOr(item, 'cha'),
    dex: getNonEmptyStringOr(item, 'dex'),
    agi: getNonEmptyStringOr(item, 'agi'),
    con: getNonEmptyStringOr(item, 'con'),
    str: getNonEmptyStringOr(item, 'str'),
    lp: getNonEmptyStringOr(item, 'lp'),
    ae: getNonEmptyStringOr(item, 'ae'),
    spi: getNonEmptyStringOr(item, 'spi'),
    tou: getNonEmptyStringOr(item, 'tou'),
    pro: getNonEmptyStringOr(item, 'pro'),
    ini: getNonEmptyStringOr(item, 'ini'),
    mov: getNonEmptyStringOr(item, 'mov'),
    at: getNonEmptyStringOr(item, 'at'),
    pa: getNonEmptyStringOr(item, 'pa')
  })) as Record<PetInstance>;
};
