import { PetEditorInstance, PetInstance } from '../types/data';
import { Record, RecordSafeKeys } from './dataUtils';

export const convertToEdit = (item: Record<PetInstance>): Record<PetEditorInstance> =>
  item.merge (Record.of ({
    size: item.lookupWithDefault<'size'> ('') ('size'),
    type: item.lookupWithDefault<'type'> ('') ('type'),
    attack: item.lookupWithDefault<'attack'> ('') ('attack'),
    dp: item.lookupWithDefault<'dp'> ('') ('dp'),
    reach: item.lookupWithDefault<'reach'> ('') ('reach'),
    actions: item.lookupWithDefault<'actions'> ('') ('actions'),
    talents: item.lookupWithDefault<'talents'> ('') ('talents'),
    skills: item.lookupWithDefault<'skills'> ('') ('skills'),
    notes: item.lookupWithDefault<'notes'> ('') ('notes'),
    spentAp: item.lookupWithDefault<'spentAp'> ('') ('spentAp'),
    totalAp: item.lookupWithDefault<'totalAp'> ('') ('totalAp'),
    cou: item.lookupWithDefault<'cou'> ('') ('cou'),
    sgc: item.lookupWithDefault<'sgc'> ('') ('sgc'),
    int: item.lookupWithDefault<'int'> ('') ('int'),
    cha: item.lookupWithDefault<'cha'> ('') ('cha'),
    dex: item.lookupWithDefault<'dex'> ('') ('dex'),
    agi: item.lookupWithDefault<'agi'> ('') ('agi'),
    con: item.lookupWithDefault<'con'> ('') ('con'),
    str: item.lookupWithDefault<'str'> ('') ('str'),
    lp: item.lookupWithDefault<'lp'> ('') ('lp'),
    ae: item.lookupWithDefault<'ae'> ('') ('ae'),
    spi: item.lookupWithDefault<'spi'> ('') ('spi'),
    tou: item.lookupWithDefault<'tou'> ('') ('tou'),
    pro: item.lookupWithDefault<'pro'> ('') ('pro'),
    ini: item.lookupWithDefault<'ini'> ('') ('ini'),
    mov: item.lookupWithDefault<'mov'> ('') ('mov'),
    at: item.lookupWithDefault<'at'> ('') ('at'),
    pa: item.lookupWithDefault<'pa'> ('') ('pa'),
  }));

export const getNewInstance = (): Record<PetEditorInstance> =>
  Record.of<PetEditorInstance> ({
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
  record.get (key).length > 0 ? record.get (key) : undefined

export const convertToSave = (item: Record<PetEditorInstance>): Record<PetInstance> => {
  return item.merge (Record.of ({
    size: getNonEmptyStringOr (item, 'size'),
    type: getNonEmptyStringOr (item, 'type'),
    attack: getNonEmptyStringOr (item, 'attack'),
    dp: getNonEmptyStringOr (item, 'dp'),
    reach: getNonEmptyStringOr (item, 'reach'),
    actions: getNonEmptyStringOr (item, 'actions'),
    talents: getNonEmptyStringOr (item, 'talents'),
    skills: getNonEmptyStringOr (item, 'skills'),
    notes: getNonEmptyStringOr (item, 'notes'),
    spentAp: getNonEmptyStringOr (item, 'spentAp'),
    totalAp: getNonEmptyStringOr (item, 'totalAp'),
    cou: getNonEmptyStringOr (item, 'cou'),
    sgc: getNonEmptyStringOr (item, 'sgc'),
    int: getNonEmptyStringOr (item, 'int'),
    cha: getNonEmptyStringOr (item, 'cha'),
    dex: getNonEmptyStringOr (item, 'dex'),
    agi: getNonEmptyStringOr (item, 'agi'),
    con: getNonEmptyStringOr (item, 'con'),
    str: getNonEmptyStringOr (item, 'str'),
    lp: getNonEmptyStringOr (item, 'lp'),
    ae: getNonEmptyStringOr (item, 'ae'),
    spi: getNonEmptyStringOr (item, 'spi'),
    tou: getNonEmptyStringOr (item, 'tou'),
    pro: getNonEmptyStringOr (item, 'pro'),
    ini: getNonEmptyStringOr (item, 'ini'),
    mov: getNonEmptyStringOr (item, 'mov'),
    at: getNonEmptyStringOr (item, 'at'),
    pa: getNonEmptyStringOr (item, 'pa')
  })) as Record<PetInstance>;
};
