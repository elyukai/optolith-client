/* TypeScript file generated from Traditions.rei by genType. */
/* eslint-disable import/first */


const $$toJS159395820: { [key: string]: any } = {"0": "Hide"};

const $$toJS253136807: { [key: string]: any } = {"0": "Male", "1": "Female"};

const $$toJS998367445: { [key: string]: any } = {"0": "All", "1": "Melee", "2": "Ranged", "3": "MeleeWithParry", "4": "OneHandedMelee"};

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const TraditionsBS = require('./Traditions.bs');

import {Activatable_t as Hero_Activatable_t} from '../../../src/App/Models/Hero.gen';

import {key as Ley_IntMap_key} from '../../../src/Data/Ley_IntMap.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as Ley_IntMap_t} from '../../../src/Data/Ley_IntMap.gen';

import {t as Static_MagicalTradition_t} from '../../../src/App/Models/Static_MagicalTradition.gen';

import {t as Static_SpecialAbility_t} from '../../../src/App/Models/Static_SpecialAbility.gen';

import {t as Static_t} from '../../../src/App/Models/Static.gen';

/** 
   * `getHeroEntries` returns active special ability entries for all active
   * magical traditions.
    */
export const Magical_getHeroEntries: (_1:Static_t, _2:Ley_IntMap_t<Hero_Activatable_t>) => list<Hero_Activatable_t> = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Magical.getHeroEntries, Arg1, Arg2);
  return result
};

/** 
   * `getStaticEntries` returns static special ability entries for all active
   * magical traditions.
    */
export const Magical_getStaticEntries: (_1:Static_t, _2:Ley_IntMap_t<Hero_Activatable_t>) => list<Static_SpecialAbility_t> = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Magical.getStaticEntries, Arg1, Arg2);
  return result
};

/** 
   * `getEntries` returns active and static special ability entries as well as
   * static tradition entries for active magical traditions.
    */
export const Magical_getEntries: (_1:Static_t, _2:Ley_IntMap_t<Hero_Activatable_t>) => list<[Static_SpecialAbility_t, Hero_Activatable_t, Static_MagicalTradition_t]> = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Magical.getEntries, Arg1, Arg2);
  return result
};

/** 
   * `idToNumId staticData id` converts a magical tradition's special ability ID
   * into a numeric tradition ID used by spells and cantrips.
    */
export const Magical_idToNumId: (_1:Static_t, _2:Ley_IntMap_key) => (null | undefined | number) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Magical.idToNumId, Arg1, Arg2);
  return result
};

/** 
   * `numIdToId staticData id` converts a numeric tradition ID used by spells
   * and cantrips into a magical tradition's special ability ID.
    */
export const Magical_numIdToId: (_1:Static_t, _2:(null | undefined | number)) => (null | undefined | number) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Magical.numIdToId, Arg1, (Arg2 == null ? undefined : Arg2));
  return result
};

/** 
   * Returns the primary attribute ID for the currently active magical
   * tradition.
    */
export const Magical_getPrimaryAttributeId: (_1:Static_t, _2:Ley_IntMap_t<Hero_Activatable_t>) => (null | undefined | number) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Magical.getPrimaryAttributeId, Arg1, Arg2);
  return result
};

/** 
   * `getHeroEntry` returns the active special ability entry for the active
   * blessed traditions.
    */
export const Blessed_getHeroEntry: (_1:Static_t, _2:Ley_IntMap_t<Hero_Activatable_t>) => (null | undefined | Hero_Activatable_t) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Blessed.getHeroEntry, Arg1, Arg2);
  return result
};

/** 
   * `getStaticEntry` returns the static special ability entry for the active
   * blessed traditions.
    */
export const Blessed_getStaticEntry: (_1:Static_t, _2:Ley_IntMap_t<Hero_Activatable_t>) => (null | undefined | Static_SpecialAbility_t) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Blessed.getStaticEntry, Arg1, Arg2);
  return (result == null ? result : {id:result.id, name:result.name, nameInWiki:result.nameInWiki, levels:result.levels, max:result.max, rules:result.rules, effect:result.effect, selectOptions:result.selectOptions, input:result.input, penalty:result.penalty, combatTechniques:(result.combatTechniques == null ? result.combatTechniques : typeof(result.combatTechniques) === 'object'
    ? {tag:"List", value:result.combatTechniques[0]}
    : $$toJS998367445[result.combatTechniques]), combatTechniquesText:result.combatTechniquesText, aeCost:result.aeCost, protectiveCircle:result.protectiveCircle, wardingCircle:result.wardingCircle, volume:result.volume, bindingCost:result.bindingCost, property:result.property, propertyText:result.propertyText, aspect:result.aspect, brew:result.brew, extended:result.extended, prerequisites:{sex:(result.prerequisites.sex == null ? result.prerequisites.sex : $$toJS253136807[result.prerequisites.sex]), race:(result.prerequisites.race == null ? result.prerequisites.race : {id:result.prerequisites.race.id.tag===0
    ? {tag:"One", value:result.prerequisites.race.id[0]}
    : {tag:"Many", value:result.prerequisites.race.id[0]}, active:result.prerequisites.race.active}), culture:(result.prerequisites.culture == null ? result.prerequisites.culture : result.prerequisites.culture.tag===0
    ? {tag:"One", value:result.prerequisites.culture[0]}
    : {tag:"Many", value:result.prerequisites.culture[0]}), pact:(result.prerequisites.pact == null ? result.prerequisites.pact : {category:result.prerequisites.pact.category, domain:(result.prerequisites.pact.domain == null ? result.prerequisites.pact.domain : result.prerequisites.pact.domain.tag===0
    ? {tag:"One", value:result.prerequisites.pact.domain[0]}
    : {tag:"Many", value:result.prerequisites.pact.domain[0]}), level:result.prerequisites.pact.level}), social:result.prerequisites.social, primaryAttribute:result.prerequisites.primaryAttribute, activatable:result.prerequisites.activatable, activatableMultiEntry:result.prerequisites.activatableMultiEntry, activatableMultiSelect:result.prerequisites.activatableMultiSelect, increasable:result.prerequisites.increasable, increasableMultiEntry:result.prerequisites.increasableMultiEntry, levels:result.prerequisites.levels}, prerequisitesText:result.prerequisitesText, prerequisitesTextIndex:{sex:(result.prerequisitesTextIndex.sex == null ? result.prerequisitesTextIndex.sex : typeof(result.prerequisitesTextIndex.sex) === 'object'
    ? {tag:"ReplaceWith", value:result.prerequisitesTextIndex.sex[0]}
    : $$toJS159395820[result.prerequisitesTextIndex.sex]), race:(result.prerequisitesTextIndex.race == null ? result.prerequisitesTextIndex.race : typeof(result.prerequisitesTextIndex.race) === 'object'
    ? {tag:"ReplaceWith", value:result.prerequisitesTextIndex.race[0]}
    : $$toJS159395820[result.prerequisitesTextIndex.race]), culture:(result.prerequisitesTextIndex.culture == null ? result.prerequisitesTextIndex.culture : typeof(result.prerequisitesTextIndex.culture) === 'object'
    ? {tag:"ReplaceWith", value:result.prerequisitesTextIndex.culture[0]}
    : $$toJS159395820[result.prerequisitesTextIndex.culture]), pact:(result.prerequisitesTextIndex.pact == null ? result.prerequisitesTextIndex.pact : typeof(result.prerequisitesTextIndex.pact) === 'object'
    ? {tag:"ReplaceWith", value:result.prerequisitesTextIndex.pact[0]}
    : $$toJS159395820[result.prerequisitesTextIndex.pact]), social:(result.prerequisitesTextIndex.social == null ? result.prerequisitesTextIndex.social : typeof(result.prerequisitesTextIndex.social) === 'object'
    ? {tag:"ReplaceWith", value:result.prerequisitesTextIndex.social[0]}
    : $$toJS159395820[result.prerequisitesTextIndex.social]), primaryAttribute:(result.prerequisitesTextIndex.primaryAttribute == null ? result.prerequisitesTextIndex.primaryAttribute : typeof(result.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? {tag:"ReplaceWith", value:result.prerequisitesTextIndex.primaryAttribute[0]}
    : $$toJS159395820[result.prerequisitesTextIndex.primaryAttribute]), activatable:result.prerequisitesTextIndex.activatable, activatableMultiEntry:result.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:result.prerequisitesTextIndex.activatableMultiSelect, increasable:result.prerequisitesTextIndex.increasable, increasableMultiEntry:result.prerequisitesTextIndex.increasableMultiEntry, levels:result.prerequisitesTextIndex.levels}, prerequisitesTextStart:result.prerequisitesTextStart, prerequisitesTextEnd:result.prerequisitesTextEnd, apValue:(result.apValue == null ? result.apValue : result.apValue.tag===0
    ? {tag:"Flat", value:result.apValue[0]}
    : {tag:"PerLevel", value:result.apValue[0]}), apValueText:result.apValueText, apValueTextAppend:result.apValueTextAppend, gr:result.gr, subgr:result.subgr, src:result.src, errata:result.errata})
};

/** 
   * `getEntry` returns the active and static special ability entry as well as
   * the static tradition entry for the active blessed traditions.
    */
export const Blessed_getEntry: (_1:Static_t, _2:Ley_IntMap_t<Hero_Activatable_t>) => (null | undefined | [Static_SpecialAbility_t, Hero_Activatable_t, Static_MagicalTradition_t]) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Blessed.getEntry, Arg1, Arg2);
  return (result == null ? result : [{id:result[0].id, name:result[0].name, nameInWiki:result[0].nameInWiki, levels:result[0].levels, max:result[0].max, rules:result[0].rules, effect:result[0].effect, selectOptions:result[0].selectOptions, input:result[0].input, penalty:result[0].penalty, combatTechniques:(result[0].combatTechniques == null ? result[0].combatTechniques : typeof(result[0].combatTechniques) === 'object'
    ? {tag:"List", value:result[0].combatTechniques[0]}
    : $$toJS998367445[result[0].combatTechniques]), combatTechniquesText:result[0].combatTechniquesText, aeCost:result[0].aeCost, protectiveCircle:result[0].protectiveCircle, wardingCircle:result[0].wardingCircle, volume:result[0].volume, bindingCost:result[0].bindingCost, property:result[0].property, propertyText:result[0].propertyText, aspect:result[0].aspect, brew:result[0].brew, extended:result[0].extended, prerequisites:{sex:(result[0].prerequisites.sex == null ? result[0].prerequisites.sex : $$toJS253136807[result[0].prerequisites.sex]), race:(result[0].prerequisites.race == null ? result[0].prerequisites.race : {id:result[0].prerequisites.race.id.tag===0
    ? {tag:"One", value:result[0].prerequisites.race.id[0]}
    : {tag:"Many", value:result[0].prerequisites.race.id[0]}, active:result[0].prerequisites.race.active}), culture:(result[0].prerequisites.culture == null ? result[0].prerequisites.culture : result[0].prerequisites.culture.tag===0
    ? {tag:"One", value:result[0].prerequisites.culture[0]}
    : {tag:"Many", value:result[0].prerequisites.culture[0]}), pact:(result[0].prerequisites.pact == null ? result[0].prerequisites.pact : {category:result[0].prerequisites.pact.category, domain:(result[0].prerequisites.pact.domain == null ? result[0].prerequisites.pact.domain : result[0].prerequisites.pact.domain.tag===0
    ? {tag:"One", value:result[0].prerequisites.pact.domain[0]}
    : {tag:"Many", value:result[0].prerequisites.pact.domain[0]}), level:result[0].prerequisites.pact.level}), social:result[0].prerequisites.social, primaryAttribute:result[0].prerequisites.primaryAttribute, activatable:result[0].prerequisites.activatable, activatableMultiEntry:result[0].prerequisites.activatableMultiEntry, activatableMultiSelect:result[0].prerequisites.activatableMultiSelect, increasable:result[0].prerequisites.increasable, increasableMultiEntry:result[0].prerequisites.increasableMultiEntry, levels:result[0].prerequisites.levels}, prerequisitesText:result[0].prerequisitesText, prerequisitesTextIndex:{sex:(result[0].prerequisitesTextIndex.sex == null ? result[0].prerequisitesTextIndex.sex : typeof(result[0].prerequisitesTextIndex.sex) === 'object'
    ? {tag:"ReplaceWith", value:result[0].prerequisitesTextIndex.sex[0]}
    : $$toJS159395820[result[0].prerequisitesTextIndex.sex]), race:(result[0].prerequisitesTextIndex.race == null ? result[0].prerequisitesTextIndex.race : typeof(result[0].prerequisitesTextIndex.race) === 'object'
    ? {tag:"ReplaceWith", value:result[0].prerequisitesTextIndex.race[0]}
    : $$toJS159395820[result[0].prerequisitesTextIndex.race]), culture:(result[0].prerequisitesTextIndex.culture == null ? result[0].prerequisitesTextIndex.culture : typeof(result[0].prerequisitesTextIndex.culture) === 'object'
    ? {tag:"ReplaceWith", value:result[0].prerequisitesTextIndex.culture[0]}
    : $$toJS159395820[result[0].prerequisitesTextIndex.culture]), pact:(result[0].prerequisitesTextIndex.pact == null ? result[0].prerequisitesTextIndex.pact : typeof(result[0].prerequisitesTextIndex.pact) === 'object'
    ? {tag:"ReplaceWith", value:result[0].prerequisitesTextIndex.pact[0]}
    : $$toJS159395820[result[0].prerequisitesTextIndex.pact]), social:(result[0].prerequisitesTextIndex.social == null ? result[0].prerequisitesTextIndex.social : typeof(result[0].prerequisitesTextIndex.social) === 'object'
    ? {tag:"ReplaceWith", value:result[0].prerequisitesTextIndex.social[0]}
    : $$toJS159395820[result[0].prerequisitesTextIndex.social]), primaryAttribute:(result[0].prerequisitesTextIndex.primaryAttribute == null ? result[0].prerequisitesTextIndex.primaryAttribute : typeof(result[0].prerequisitesTextIndex.primaryAttribute) === 'object'
    ? {tag:"ReplaceWith", value:result[0].prerequisitesTextIndex.primaryAttribute[0]}
    : $$toJS159395820[result[0].prerequisitesTextIndex.primaryAttribute]), activatable:result[0].prerequisitesTextIndex.activatable, activatableMultiEntry:result[0].prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:result[0].prerequisitesTextIndex.activatableMultiSelect, increasable:result[0].prerequisitesTextIndex.increasable, increasableMultiEntry:result[0].prerequisitesTextIndex.increasableMultiEntry, levels:result[0].prerequisitesTextIndex.levels}, prerequisitesTextStart:result[0].prerequisitesTextStart, prerequisitesTextEnd:result[0].prerequisitesTextEnd, apValue:(result[0].apValue == null ? result[0].apValue : result[0].apValue.tag===0
    ? {tag:"Flat", value:result[0].apValue[0]}
    : {tag:"PerLevel", value:result[0].apValue[0]}), apValueText:result[0].apValueText, apValueTextAppend:result[0].apValueTextAppend, gr:result[0].gr, subgr:result[0].subgr, src:result[0].src, errata:result[0].errata}, result[1], result[2]])
};

/** 
   * `idToNumId staticData id` converts a blessed tradition's special ability ID
   * into a numeric tradition ID used by chants and blessings.
    */
export const Blessed_idToNumId: (_1:Static_t, _2:Ley_IntMap_key) => (null | undefined | number) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Blessed.idToNumId, Arg1, Arg2);
  return result
};

/** 
   * `numIdToId staticData id` converts a numeric tradition ID used by chants
   * and blessings into a blessed tradition's special ability ID.
    */
export const Blessed_numIdToId: (_1:Static_t, _2:number) => (null | undefined | number) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Blessed.numIdToId, Arg1, Arg2);
  return result
};

/** 
   * Returns the primary attribute ID for the currently active blessed
   * tradition.
    */
export const Blessed_getPrimaryAttributeId: (_1:Static_t, _2:Ley_IntMap_t<Hero_Activatable_t>) => (null | undefined | number) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(TraditionsBS.Blessed.getPrimaryAttributeId, Arg1, Arg2);
  return result
};
