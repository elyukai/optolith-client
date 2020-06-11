/* TypeScript file generated from Activatable.rei by genType. */
/* eslint-disable import/first */


const $$toRE159395820: { [key: string]: any } = {"Hide": 0};

const $$toJS253136807: { [key: string]: any } = {"0": "Male", "1": "Female"};

const $$toRE253136807: { [key: string]: any } = {"Male": 0, "Female": 1};

const $$toJS395247248: { [key: string]: any } = {"0": "True", "1": "False"};

const $$toJS774684822: { [key: string]: any } = {"0": "SPI", "1": "DOUBLE_SPI", "2": "TOU", "3": "MAX_SPI_TOU"};

const $$toRE844170071: { [key: string]: any } = {"Outline": 0, "Definition": 1, "Advancement": 2};

const $$toRE998367445: { [key: string]: any } = {"All": 0, "Melee": 1, "Ranged": 2, "MeleeWithParry": 3, "OneHandedMelee": 4};

// tslint:disable-next-line:no-var-requires
const CreateBucklescriptBlock = require('bs-platform/lib/es6/block.js');

// tslint:disable-next-line:no-var-requires
const Curry = require('bs-platform/lib/es6/curry.js');

// tslint:disable-next-line:no-var-requires
const ActivatableBS = require('./Activatable.bs');

import {Activatable_optionId as Hero_Activatable_optionId} from '../../../src/App/Models/Hero.gen';

import {Activatable_t as Hero_Activatable_t} from '../../../src/App/Models/Hero.gen';

import {activatable as Static_activatable} from '../../../src/App/Models/Static.gen';

import {list} from '../../../src/shims/ReasonPervasives.shim';

import {t as Hero_t} from '../../../src/App/Models/Hero.gen';

import {t as Static_SelectOption_t} from '../../../src/App/Models/Static_SelectOption.gen';

import {t as Static_t} from '../../../src/App/Models/Static.gen';

// tslint:disable-next-line:interface-over-type-literal
export type singleWithId = {
  readonly id: number; 
  readonly options: list<Hero_Activatable_optionId>; 
  readonly level?: number; 
  readonly customCost?: number
};
export type ActivatableSingleWithId = singleWithId;

// tslint:disable-next-line:interface-over-type-literal
export type Names_combinedName = {
  readonly name: string; 
  readonly baseName: string; 
  readonly addName?: string; 
  readonly levelName?: string
};
export type CombinedName = Names_combinedName;

// tslint:disable-next-line:interface-over-type-literal
export type AdventurePoints_combinedApValue = { readonly apValue: number; readonly isAutomatic: boolean };

/** 
 * Is an Activatable entry active?
  */
export const isActive: (_1:Hero_Activatable_t) => boolean = ActivatableBS.isActive;

/** 
 * Is an Activatable, where the entry may not have been created, active?
  */
export const isActiveM: (_1:(null | undefined | Hero_Activatable_t)) => boolean = function (Arg1: any) {
  const result = ActivatableBS.isActiveM((Arg1 == null ? undefined : Arg1));
  return result
};

/** 
   * Converts an Activatable hero entry containing all of it's activations into
   * a "flattened" list of it's activations.
    */
export const Convert_heroEntryToSingles: (_1:Hero_Activatable_t) => list<singleWithId> = ActivatableBS.Convert.heroEntryToSingles;

/** 
   * Get a select option with the given id from given static entry. Returns
   * `Nothing` if not found.
    */
export const SelectOptions_getSelectOption: (_1:Static_activatable, _2:Hero_Activatable_optionId) => (null | undefined | Static_SelectOption_t) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(ActivatableBS.SelectOptions.getSelectOption, Arg1.tag==="Advantage"
    ? CreateBucklescriptBlock.__(0, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, noMaxAPInfluence:Arg1.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg1.value.isExclusiveToArcaneSpellworks, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, range:Arg1.value.range, actions:Arg1.value.actions, prerequisites:{commonSuggestedByRCP:Arg1.value.prerequisites.commonSuggestedByRCP, sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, src:Arg1.value.src, errata:Arg1.value.errata}])
    : Arg1.tag==="Disadvantage"
    ? CreateBucklescriptBlock.__(1, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, noMaxAPInfluence:Arg1.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg1.value.isExclusiveToArcaneSpellworks, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, range:Arg1.value.range, actions:Arg1.value.actions, prerequisites:{commonSuggestedByRCP:Arg1.value.prerequisites.commonSuggestedByRCP, sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, src:Arg1.value.src, errata:Arg1.value.errata}])
    : CreateBucklescriptBlock.__(2, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, effect:Arg1.value.effect, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, penalty:Arg1.value.penalty, combatTechniques:(Arg1.value.combatTechniques == null ? undefined : typeof(Arg1.value.combatTechniques) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.combatTechniques.value])
    : $$toRE998367445[Arg1.value.combatTechniques]), combatTechniquesText:Arg1.value.combatTechniquesText, aeCost:Arg1.value.aeCost, protectiveCircle:Arg1.value.protectiveCircle, wardingCircle:Arg1.value.wardingCircle, volume:Arg1.value.volume, bindingCost:Arg1.value.bindingCost, property:Arg1.value.property, propertyText:Arg1.value.propertyText, aspect:Arg1.value.aspect, brew:Arg1.value.brew, extended:Arg1.value.extended, prerequisites:{sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, subgr:Arg1.value.subgr, src:Arg1.value.src, errata:Arg1.value.errata}]), Arg2);
  return (result == null ? result : {id:result.id[0]===/* Generic */61643255
    ? {tag:"Generic", value:result.id[1]}
    : result.id[0]===/* Skill */290194801
    ? {tag:"Skill", value:result.id[1]}
    : result.id[0]===/* CombatTechnique */-920806756
    ? {tag:"CombatTechnique", value:result.id[1]}
    : result.id[0]===/* Spell */345443720
    ? {tag:"Spell", value:result.id[1]}
    : result.id[0]===/* Cantrip */-841776939
    ? {tag:"Cantrip", value:result.id[1]}
    : result.id[0]===/* LiturgicalChant */-384382742
    ? {tag:"LiturgicalChant", value:result.id[1]}
    : {tag:"Blessing", value:result.id[1]}, name:result.name, cost:result.cost, prerequisites:{sex:(result.prerequisites.sex == null ? result.prerequisites.sex : $$toJS253136807[result.prerequisites.sex]), race:(result.prerequisites.race == null ? result.prerequisites.race : {id:result.prerequisites.race.id.tag===0
    ? {tag:"One", value:result.prerequisites.race.id[0]}
    : {tag:"Many", value:result.prerequisites.race.id[0]}, active:result.prerequisites.race.active}), culture:(result.prerequisites.culture == null ? result.prerequisites.culture : result.prerequisites.culture.tag===0
    ? {tag:"One", value:result.prerequisites.culture[0]}
    : {tag:"Many", value:result.prerequisites.culture[0]}), pact:(result.prerequisites.pact == null ? result.prerequisites.pact : {category:result.prerequisites.pact.category, domain:(result.prerequisites.pact.domain == null ? result.prerequisites.pact.domain : result.prerequisites.pact.domain.tag===0
    ? {tag:"One", value:result.prerequisites.pact.domain[0]}
    : {tag:"Many", value:result.prerequisites.pact.domain[0]}), level:result.prerequisites.pact.level}), social:result.prerequisites.social, primaryAttribute:result.prerequisites.primaryAttribute, activatable:result.prerequisites.activatable, activatableMultiEntry:result.prerequisites.activatableMultiEntry, activatableMultiSelect:result.prerequisites.activatableMultiSelect, increasable:result.prerequisites.increasable, increasableMultiEntry:result.prerequisites.increasableMultiEntry}, description:result.description, isSecret:result.isSecret, languages:result.languages, continent:result.continent, isExtinct:result.isExtinct, specializations:result.specializations, specializationInput:result.specializationInput, animalGr:result.animalGr, animalLevel:result.animalLevel, enhancementTarget:result.enhancementTarget, enhancementLevel:result.enhancementLevel, wikiEntry:(result.wikiEntry == null ? result.wikiEntry : result.wikiEntry.tag===0
    ? {tag:"Blessing", value:result.wikiEntry[0]}
    : result.wikiEntry.tag===1
    ? {tag:"Cantrip", value:result.wikiEntry[0]}
    : result.wikiEntry.tag===2
    ? {tag:"CombatTechnique", value:result.wikiEntry[0]}
    : result.wikiEntry.tag===3
    ? {tag:"LiturgicalChant", value:{id:result.wikiEntry[0].id, name:result.wikiEntry[0].name, check:result.wikiEntry[0].check, checkMod:(result.wikiEntry[0].checkMod == null ? result.wikiEntry[0].checkMod : $$toJS774684822[result.wikiEntry[0].checkMod]), effect:result.wikiEntry[0].effect, castingTime:result.wikiEntry[0].castingTime, castingTimeShort:result.wikiEntry[0].castingTimeShort, castingTimeNoMod:result.wikiEntry[0].castingTimeNoMod, kpCost:result.wikiEntry[0].kpCost, kpCostShort:result.wikiEntry[0].kpCostShort, kpCostNoMod:result.wikiEntry[0].kpCostNoMod, range:result.wikiEntry[0].range, rangeShort:result.wikiEntry[0].rangeShort, rangeNoMod:result.wikiEntry[0].rangeNoMod, duration:result.wikiEntry[0].duration, durationShort:result.wikiEntry[0].durationShort, durationNoMod:result.wikiEntry[0].durationNoMod, target:result.wikiEntry[0].target, traditions:result.wikiEntry[0].traditions, aspects:result.wikiEntry[0].aspects, ic:result.wikiEntry[0].ic, gr:result.wikiEntry[0].gr, src:result.wikiEntry[0].src, errata:result.wikiEntry[0].errata}}
    : result.wikiEntry.tag===4
    ? {tag:"Skill", value:{id:result.wikiEntry[0].id, name:result.wikiEntry[0].name, check:result.wikiEntry[0].check, encumbrance:typeof(result.wikiEntry[0].encumbrance) === 'object'
    ? {tag:"Maybe", value:result.wikiEntry[0].encumbrance[0]}
    : $$toJS395247248[result.wikiEntry[0].encumbrance], gr:result.wikiEntry[0].gr, ic:result.wikiEntry[0].ic, applications:result.wikiEntry[0].applications, applicationsInput:result.wikiEntry[0].applicationsInput, uses:result.wikiEntry[0].uses, tools:result.wikiEntry[0].tools, quality:result.wikiEntry[0].quality, failed:result.wikiEntry[0].failed, critical:result.wikiEntry[0].critical, botch:result.wikiEntry[0].botch, src:result.wikiEntry[0].src, errata:result.wikiEntry[0].errata}}
    : {tag:"Spell", value:{id:result.wikiEntry[0].id, name:result.wikiEntry[0].name, check:result.wikiEntry[0].check, checkMod:(result.wikiEntry[0].checkMod == null ? result.wikiEntry[0].checkMod : $$toJS774684822[result.wikiEntry[0].checkMod]), effect:result.wikiEntry[0].effect, castingTime:result.wikiEntry[0].castingTime, castingTimeShort:result.wikiEntry[0].castingTimeShort, castingTimeNoMod:result.wikiEntry[0].castingTimeNoMod, aeCost:result.wikiEntry[0].aeCost, aeCostShort:result.wikiEntry[0].aeCostShort, aeCostNoMod:result.wikiEntry[0].aeCostNoMod, range:result.wikiEntry[0].range, rangeShort:result.wikiEntry[0].rangeShort, rangeNoMod:result.wikiEntry[0].rangeNoMod, duration:result.wikiEntry[0].duration, durationShort:result.wikiEntry[0].durationShort, durationNoMod:result.wikiEntry[0].durationNoMod, target:result.wikiEntry[0].target, property:result.wikiEntry[0].property, traditions:result.wikiEntry[0].traditions, ic:result.wikiEntry[0].ic, activatablePrerequisites:result.wikiEntry[0].activatablePrerequisites, increasablePrerequisites:result.wikiEntry[0].increasablePrerequisites, gr:result.wikiEntry[0].gr, src:result.wikiEntry[0].src, errata:result.wikiEntry[0].errata}}), src:result.src, errata:result.errata})
};

/** 
   * Get a select option's name with the given id from given static entry.
   * Returns `Nothing` if not found.
    */
export const SelectOptions_getSelectOptionName: (_1:Static_activatable, _2:Hero_Activatable_optionId) => (null | undefined | string) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(ActivatableBS.SelectOptions.getSelectOptionName, Arg1.tag==="Advantage"
    ? CreateBucklescriptBlock.__(0, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, noMaxAPInfluence:Arg1.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg1.value.isExclusiveToArcaneSpellworks, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, range:Arg1.value.range, actions:Arg1.value.actions, prerequisites:{commonSuggestedByRCP:Arg1.value.prerequisites.commonSuggestedByRCP, sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, src:Arg1.value.src, errata:Arg1.value.errata}])
    : Arg1.tag==="Disadvantage"
    ? CreateBucklescriptBlock.__(1, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, noMaxAPInfluence:Arg1.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg1.value.isExclusiveToArcaneSpellworks, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, range:Arg1.value.range, actions:Arg1.value.actions, prerequisites:{commonSuggestedByRCP:Arg1.value.prerequisites.commonSuggestedByRCP, sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, src:Arg1.value.src, errata:Arg1.value.errata}])
    : CreateBucklescriptBlock.__(2, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, effect:Arg1.value.effect, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, penalty:Arg1.value.penalty, combatTechniques:(Arg1.value.combatTechniques == null ? undefined : typeof(Arg1.value.combatTechniques) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.combatTechniques.value])
    : $$toRE998367445[Arg1.value.combatTechniques]), combatTechniquesText:Arg1.value.combatTechniquesText, aeCost:Arg1.value.aeCost, protectiveCircle:Arg1.value.protectiveCircle, wardingCircle:Arg1.value.wardingCircle, volume:Arg1.value.volume, bindingCost:Arg1.value.bindingCost, property:Arg1.value.property, propertyText:Arg1.value.propertyText, aspect:Arg1.value.aspect, brew:Arg1.value.brew, extended:Arg1.value.extended, prerequisites:{sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, subgr:Arg1.value.subgr, src:Arg1.value.src, errata:Arg1.value.errata}]), Arg2);
  return result
};

/** 
   * Get a select option's cost with the given id from given static entry.
   * Returns `Nothing` if not found.
    */
export const SelectOptions_getSelectOptionCost: (_1:Static_activatable, _2:Hero_Activatable_optionId) => (null | undefined | number) = function (Arg1: any, Arg2: any) {
  const result = Curry._2(ActivatableBS.SelectOptions.getSelectOptionCost, Arg1.tag==="Advantage"
    ? CreateBucklescriptBlock.__(0, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, noMaxAPInfluence:Arg1.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg1.value.isExclusiveToArcaneSpellworks, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, range:Arg1.value.range, actions:Arg1.value.actions, prerequisites:{commonSuggestedByRCP:Arg1.value.prerequisites.commonSuggestedByRCP, sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, src:Arg1.value.src, errata:Arg1.value.errata}])
    : Arg1.tag==="Disadvantage"
    ? CreateBucklescriptBlock.__(1, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, noMaxAPInfluence:Arg1.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg1.value.isExclusiveToArcaneSpellworks, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, range:Arg1.value.range, actions:Arg1.value.actions, prerequisites:{commonSuggestedByRCP:Arg1.value.prerequisites.commonSuggestedByRCP, sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, src:Arg1.value.src, errata:Arg1.value.errata}])
    : CreateBucklescriptBlock.__(2, [{id:Arg1.value.id, name:Arg1.value.name, nameInWiki:Arg1.value.nameInWiki, levels:Arg1.value.levels, max:Arg1.value.max, rules:Arg1.value.rules, effect:Arg1.value.effect, selectOptions:Arg1.value.selectOptions, input:Arg1.value.input, penalty:Arg1.value.penalty, combatTechniques:(Arg1.value.combatTechniques == null ? undefined : typeof(Arg1.value.combatTechniques) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.combatTechniques.value])
    : $$toRE998367445[Arg1.value.combatTechniques]), combatTechniquesText:Arg1.value.combatTechniquesText, aeCost:Arg1.value.aeCost, protectiveCircle:Arg1.value.protectiveCircle, wardingCircle:Arg1.value.wardingCircle, volume:Arg1.value.volume, bindingCost:Arg1.value.bindingCost, property:Arg1.value.property, propertyText:Arg1.value.propertyText, aspect:Arg1.value.aspect, brew:Arg1.value.brew, extended:Arg1.value.extended, prerequisites:{sex:(Arg1.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg1.value.prerequisites.sex]), race:(Arg1.value.prerequisites.race == null ? undefined : {id:Arg1.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.race.id.value]), active:Arg1.value.prerequisites.race.active}), culture:(Arg1.value.prerequisites.culture == null ? undefined : Arg1.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.culture.value])), pact:(Arg1.value.prerequisites.pact == null ? undefined : {category:Arg1.value.prerequisites.pact.category, domain:(Arg1.value.prerequisites.pact.domain == null ? undefined : Arg1.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.prerequisites.pact.domain.value])), level:Arg1.value.prerequisites.pact.level}), social:Arg1.value.prerequisites.social, primaryAttribute:Arg1.value.prerequisites.primaryAttribute, activatable:Arg1.value.prerequisites.activatable, activatableMultiEntry:Arg1.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisites.activatableMultiSelect, increasable:Arg1.value.prerequisites.increasable, increasableMultiEntry:Arg1.value.prerequisites.increasableMultiEntry, levels:Arg1.value.prerequisites.levels}, prerequisitesText:Arg1.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg1.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.sex]), race:(Arg1.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.race]), culture:(Arg1.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.culture]), pact:(Arg1.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.pact]), social:(Arg1.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg1.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg1.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg1.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg1.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg1.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg1.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg1.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg1.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg1.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg1.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg1.value.prerequisitesTextStart, prerequisitesTextEnd:Arg1.value.prerequisitesTextEnd, apValue:(Arg1.value.apValue == null ? undefined : Arg1.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg1.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg1.value.apValue.value])), apValueText:Arg1.value.apValueText, apValueTextAppend:Arg1.value.apValueTextAppend, gr:Arg1.value.gr, subgr:Arg1.value.subgr, src:Arg1.value.src, errata:Arg1.value.errata}]), Arg2);
  return result
};

/** 
   * Get all first select option IDs from the given entry.
    */
export const SelectOptions_getActiveSelections: (_1:Hero_Activatable_t) => list<Hero_Activatable_optionId> = ActivatableBS.SelectOptions.getActiveSelections;

/** 
   * `getName addLevelToName staticData staticActivatable singleEntry` returns
   * the name, splitted and combined, of the passed `singleEntry`.
    */
export const Names_getName: (_1:{ readonly addLevelToName: boolean }, _2:Static_t, _3:Static_activatable, _4:singleWithId) => Names_combinedName = function (Arg1: any, Arg2: any, Arg3: any, Arg4: any) {
  const result = Curry._4(ActivatableBS.Names.getName, Arg1.addLevelToName, Arg2, Arg3.tag==="Advantage"
    ? CreateBucklescriptBlock.__(0, [{id:Arg3.value.id, name:Arg3.value.name, nameInWiki:Arg3.value.nameInWiki, noMaxAPInfluence:Arg3.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg3.value.isExclusiveToArcaneSpellworks, levels:Arg3.value.levels, max:Arg3.value.max, rules:Arg3.value.rules, selectOptions:Arg3.value.selectOptions, input:Arg3.value.input, range:Arg3.value.range, actions:Arg3.value.actions, prerequisites:{commonSuggestedByRCP:Arg3.value.prerequisites.commonSuggestedByRCP, sex:(Arg3.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg3.value.prerequisites.sex]), race:(Arg3.value.prerequisites.race == null ? undefined : {id:Arg3.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.race.id.value]), active:Arg3.value.prerequisites.race.active}), culture:(Arg3.value.prerequisites.culture == null ? undefined : Arg3.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.culture.value])), pact:(Arg3.value.prerequisites.pact == null ? undefined : {category:Arg3.value.prerequisites.pact.category, domain:(Arg3.value.prerequisites.pact.domain == null ? undefined : Arg3.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.pact.domain.value])), level:Arg3.value.prerequisites.pact.level}), social:Arg3.value.prerequisites.social, primaryAttribute:Arg3.value.prerequisites.primaryAttribute, activatable:Arg3.value.prerequisites.activatable, activatableMultiEntry:Arg3.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg3.value.prerequisites.activatableMultiSelect, increasable:Arg3.value.prerequisites.increasable, increasableMultiEntry:Arg3.value.prerequisites.increasableMultiEntry, levels:Arg3.value.prerequisites.levels}, prerequisitesText:Arg3.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg3.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.sex]), race:(Arg3.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.race]), culture:(Arg3.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.culture]), pact:(Arg3.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.pact]), social:(Arg3.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg3.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg3.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg3.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg3.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg3.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg3.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg3.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg3.value.prerequisitesTextStart, prerequisitesTextEnd:Arg3.value.prerequisitesTextEnd, apValue:(Arg3.value.apValue == null ? undefined : Arg3.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.apValue.value])), apValueText:Arg3.value.apValueText, apValueTextAppend:Arg3.value.apValueTextAppend, gr:Arg3.value.gr, src:Arg3.value.src, errata:Arg3.value.errata}])
    : Arg3.tag==="Disadvantage"
    ? CreateBucklescriptBlock.__(1, [{id:Arg3.value.id, name:Arg3.value.name, nameInWiki:Arg3.value.nameInWiki, noMaxAPInfluence:Arg3.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg3.value.isExclusiveToArcaneSpellworks, levels:Arg3.value.levels, max:Arg3.value.max, rules:Arg3.value.rules, selectOptions:Arg3.value.selectOptions, input:Arg3.value.input, range:Arg3.value.range, actions:Arg3.value.actions, prerequisites:{commonSuggestedByRCP:Arg3.value.prerequisites.commonSuggestedByRCP, sex:(Arg3.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg3.value.prerequisites.sex]), race:(Arg3.value.prerequisites.race == null ? undefined : {id:Arg3.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.race.id.value]), active:Arg3.value.prerequisites.race.active}), culture:(Arg3.value.prerequisites.culture == null ? undefined : Arg3.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.culture.value])), pact:(Arg3.value.prerequisites.pact == null ? undefined : {category:Arg3.value.prerequisites.pact.category, domain:(Arg3.value.prerequisites.pact.domain == null ? undefined : Arg3.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.pact.domain.value])), level:Arg3.value.prerequisites.pact.level}), social:Arg3.value.prerequisites.social, primaryAttribute:Arg3.value.prerequisites.primaryAttribute, activatable:Arg3.value.prerequisites.activatable, activatableMultiEntry:Arg3.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg3.value.prerequisites.activatableMultiSelect, increasable:Arg3.value.prerequisites.increasable, increasableMultiEntry:Arg3.value.prerequisites.increasableMultiEntry, levels:Arg3.value.prerequisites.levels}, prerequisitesText:Arg3.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg3.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.sex]), race:(Arg3.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.race]), culture:(Arg3.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.culture]), pact:(Arg3.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.pact]), social:(Arg3.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg3.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg3.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg3.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg3.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg3.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg3.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg3.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg3.value.prerequisitesTextStart, prerequisitesTextEnd:Arg3.value.prerequisitesTextEnd, apValue:(Arg3.value.apValue == null ? undefined : Arg3.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.apValue.value])), apValueText:Arg3.value.apValueText, apValueTextAppend:Arg3.value.apValueTextAppend, gr:Arg3.value.gr, src:Arg3.value.src, errata:Arg3.value.errata}])
    : CreateBucklescriptBlock.__(2, [{id:Arg3.value.id, name:Arg3.value.name, nameInWiki:Arg3.value.nameInWiki, levels:Arg3.value.levels, max:Arg3.value.max, rules:Arg3.value.rules, effect:Arg3.value.effect, selectOptions:Arg3.value.selectOptions, input:Arg3.value.input, penalty:Arg3.value.penalty, combatTechniques:(Arg3.value.combatTechniques == null ? undefined : typeof(Arg3.value.combatTechniques) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.combatTechniques.value])
    : $$toRE998367445[Arg3.value.combatTechniques]), combatTechniquesText:Arg3.value.combatTechniquesText, aeCost:Arg3.value.aeCost, protectiveCircle:Arg3.value.protectiveCircle, wardingCircle:Arg3.value.wardingCircle, volume:Arg3.value.volume, bindingCost:Arg3.value.bindingCost, property:Arg3.value.property, propertyText:Arg3.value.propertyText, aspect:Arg3.value.aspect, brew:Arg3.value.brew, extended:Arg3.value.extended, prerequisites:{sex:(Arg3.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg3.value.prerequisites.sex]), race:(Arg3.value.prerequisites.race == null ? undefined : {id:Arg3.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.race.id.value]), active:Arg3.value.prerequisites.race.active}), culture:(Arg3.value.prerequisites.culture == null ? undefined : Arg3.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.culture.value])), pact:(Arg3.value.prerequisites.pact == null ? undefined : {category:Arg3.value.prerequisites.pact.category, domain:(Arg3.value.prerequisites.pact.domain == null ? undefined : Arg3.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.prerequisites.pact.domain.value])), level:Arg3.value.prerequisites.pact.level}), social:Arg3.value.prerequisites.social, primaryAttribute:Arg3.value.prerequisites.primaryAttribute, activatable:Arg3.value.prerequisites.activatable, activatableMultiEntry:Arg3.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg3.value.prerequisites.activatableMultiSelect, increasable:Arg3.value.prerequisites.increasable, increasableMultiEntry:Arg3.value.prerequisites.increasableMultiEntry, levels:Arg3.value.prerequisites.levels}, prerequisitesText:Arg3.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg3.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.sex]), race:(Arg3.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.race]), culture:(Arg3.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.culture]), pact:(Arg3.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.pact]), social:(Arg3.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg3.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg3.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg3.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg3.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg3.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg3.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg3.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg3.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg3.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg3.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg3.value.prerequisitesTextStart, prerequisitesTextEnd:Arg3.value.prerequisitesTextEnd, apValue:(Arg3.value.apValue == null ? undefined : Arg3.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg3.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg3.value.apValue.value])), apValueText:Arg3.value.apValueText, apValueTextAppend:Arg3.value.apValueTextAppend, gr:Arg3.value.gr, subgr:Arg3.value.subgr, src:Arg3.value.src, errata:Arg3.value.errata}]), Arg4);
  return result
};

/** 
   * `getApValue isEntryToAdd automaticAdvantages staticData hero
   * staticActivatable heroActivatable singleEntry` returns the AP you get when
   * removing the passed `singleEntry`. It also returns if the entry has been
   * automatically granted by the race.
   *
   * `isEntryToAdd` has to be `true` if `singleEntry` has not been added
   * to the list of active entries yet, otherwise `false`. `automaticAdvantages`
   * is the list of automatic advantage IDs.
    */
export const AdventurePoints_getApValue: (_1:{ readonly isEntryToAdd: boolean; readonly automaticAdvantages: list<number> }, _2:Static_t, _3:Hero_t, _4:Static_activatable, _5:Hero_Activatable_t, _6:singleWithId) => AdventurePoints_combinedApValue = function (Arg1: any, Arg2: any, Arg3: any, Arg4: any, Arg5: any, Arg6: any) {
  const result = Curry._7(ActivatableBS.AdventurePoints.getApValue, Arg1.isEntryToAdd, Arg1.automaticAdvantages, Arg2, {id:Arg3.id, name:Arg3.name, dateCreated:Arg3.dateCreated, dateModified:Arg3.dateModified, adventurePointsTotal:Arg3.adventurePointsTotal, experienceLevel:Arg3.experienceLevel, sex:$$toRE253136807[Arg3.sex], phase:$$toRE844170071[Arg3.phase], locale:Arg3.locale, avatar:Arg3.avatar, race:Arg3.race, raceVariant:(Arg3.raceVariant == null ? undefined : Arg3.raceVariant.tag==="Base"
    ? CreateBucklescriptBlock.__(0, [Arg3.raceVariant.value])
    : CreateBucklescriptBlock.__(1, Arg3.raceVariant.value)), culture:Arg3.culture, isCulturalPackageActive:Arg3.isCulturalPackageActive, profession:(Arg3.profession == null ? undefined : Arg3.profession.tag==="Base"
    ? CreateBucklescriptBlock.__(0, [Arg3.profession.value])
    : CreateBucklescriptBlock.__(1, Arg3.profession.value)), professionName:Arg3.professionName, rules:Arg3.rules, personalData:Arg3.personalData, advantages:Arg3.advantages, disadvantages:Arg3.disadvantages, specialAbilities:Arg3.specialAbilities, attributes:Arg3.attributes, attributeAdjustmentSelected:Arg3.attributeAdjustmentSelected, energies:Arg3.energies, skills:Arg3.skills, combatTechniques:Arg3.combatTechniques, spells:Arg3.spells, liturgicalChants:Arg3.liturgicalChants, cantrips:Arg3.cantrips, blessings:Arg3.blessings, items:Arg3.items, hitZoneArmors:Arg3.hitZoneArmors, purse:Arg3.purse, pets:Arg3.pets, pact:(Arg3.pact == null ? undefined : {category:Arg3.pact.category, level:Arg3.pact.level, type:Arg3.pact.type, domain:Arg3.pact.domain.tag==="Predefined"
    ? CreateBucklescriptBlock.__(0, [Arg3.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg3.pact.domain.value]), name:Arg3.pact.name}), combatStyleDependencies:Arg3.combatStyleDependencies, magicalStyleDependencies:Arg3.magicalStyleDependencies, blessedStyleDependencies:Arg3.blessedStyleDependencies, skillStyleDependencies:Arg3.skillStyleDependencies, socialStatusDependencies:Arg3.socialStatusDependencies, transferredUnfamiliarSpells:Arg3.transferredUnfamiliarSpells}, Arg4.tag==="Advantage"
    ? CreateBucklescriptBlock.__(0, [{id:Arg4.value.id, name:Arg4.value.name, nameInWiki:Arg4.value.nameInWiki, noMaxAPInfluence:Arg4.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg4.value.isExclusiveToArcaneSpellworks, levels:Arg4.value.levels, max:Arg4.value.max, rules:Arg4.value.rules, selectOptions:Arg4.value.selectOptions, input:Arg4.value.input, range:Arg4.value.range, actions:Arg4.value.actions, prerequisites:{commonSuggestedByRCP:Arg4.value.prerequisites.commonSuggestedByRCP, sex:(Arg4.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg4.value.prerequisites.sex]), race:(Arg4.value.prerequisites.race == null ? undefined : {id:Arg4.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.race.id.value]), active:Arg4.value.prerequisites.race.active}), culture:(Arg4.value.prerequisites.culture == null ? undefined : Arg4.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.culture.value])), pact:(Arg4.value.prerequisites.pact == null ? undefined : {category:Arg4.value.prerequisites.pact.category, domain:(Arg4.value.prerequisites.pact.domain == null ? undefined : Arg4.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.pact.domain.value])), level:Arg4.value.prerequisites.pact.level}), social:Arg4.value.prerequisites.social, primaryAttribute:Arg4.value.prerequisites.primaryAttribute, activatable:Arg4.value.prerequisites.activatable, activatableMultiEntry:Arg4.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg4.value.prerequisites.activatableMultiSelect, increasable:Arg4.value.prerequisites.increasable, increasableMultiEntry:Arg4.value.prerequisites.increasableMultiEntry, levels:Arg4.value.prerequisites.levels}, prerequisitesText:Arg4.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg4.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.sex]), race:(Arg4.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.race]), culture:(Arg4.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.culture]), pact:(Arg4.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.pact]), social:(Arg4.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg4.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg4.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg4.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg4.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg4.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg4.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg4.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg4.value.prerequisitesTextStart, prerequisitesTextEnd:Arg4.value.prerequisitesTextEnd, apValue:(Arg4.value.apValue == null ? undefined : Arg4.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.apValue.value])), apValueText:Arg4.value.apValueText, apValueTextAppend:Arg4.value.apValueTextAppend, gr:Arg4.value.gr, src:Arg4.value.src, errata:Arg4.value.errata}])
    : Arg4.tag==="Disadvantage"
    ? CreateBucklescriptBlock.__(1, [{id:Arg4.value.id, name:Arg4.value.name, nameInWiki:Arg4.value.nameInWiki, noMaxAPInfluence:Arg4.value.noMaxAPInfluence, isExclusiveToArcaneSpellworks:Arg4.value.isExclusiveToArcaneSpellworks, levels:Arg4.value.levels, max:Arg4.value.max, rules:Arg4.value.rules, selectOptions:Arg4.value.selectOptions, input:Arg4.value.input, range:Arg4.value.range, actions:Arg4.value.actions, prerequisites:{commonSuggestedByRCP:Arg4.value.prerequisites.commonSuggestedByRCP, sex:(Arg4.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg4.value.prerequisites.sex]), race:(Arg4.value.prerequisites.race == null ? undefined : {id:Arg4.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.race.id.value]), active:Arg4.value.prerequisites.race.active}), culture:(Arg4.value.prerequisites.culture == null ? undefined : Arg4.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.culture.value])), pact:(Arg4.value.prerequisites.pact == null ? undefined : {category:Arg4.value.prerequisites.pact.category, domain:(Arg4.value.prerequisites.pact.domain == null ? undefined : Arg4.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.pact.domain.value])), level:Arg4.value.prerequisites.pact.level}), social:Arg4.value.prerequisites.social, primaryAttribute:Arg4.value.prerequisites.primaryAttribute, activatable:Arg4.value.prerequisites.activatable, activatableMultiEntry:Arg4.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg4.value.prerequisites.activatableMultiSelect, increasable:Arg4.value.prerequisites.increasable, increasableMultiEntry:Arg4.value.prerequisites.increasableMultiEntry, levels:Arg4.value.prerequisites.levels}, prerequisitesText:Arg4.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg4.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.sex]), race:(Arg4.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.race]), culture:(Arg4.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.culture]), pact:(Arg4.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.pact]), social:(Arg4.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg4.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg4.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg4.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg4.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg4.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg4.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg4.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg4.value.prerequisitesTextStart, prerequisitesTextEnd:Arg4.value.prerequisitesTextEnd, apValue:(Arg4.value.apValue == null ? undefined : Arg4.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.apValue.value])), apValueText:Arg4.value.apValueText, apValueTextAppend:Arg4.value.apValueTextAppend, gr:Arg4.value.gr, src:Arg4.value.src, errata:Arg4.value.errata}])
    : CreateBucklescriptBlock.__(2, [{id:Arg4.value.id, name:Arg4.value.name, nameInWiki:Arg4.value.nameInWiki, levels:Arg4.value.levels, max:Arg4.value.max, rules:Arg4.value.rules, effect:Arg4.value.effect, selectOptions:Arg4.value.selectOptions, input:Arg4.value.input, penalty:Arg4.value.penalty, combatTechniques:(Arg4.value.combatTechniques == null ? undefined : typeof(Arg4.value.combatTechniques) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.combatTechniques.value])
    : $$toRE998367445[Arg4.value.combatTechniques]), combatTechniquesText:Arg4.value.combatTechniquesText, aeCost:Arg4.value.aeCost, protectiveCircle:Arg4.value.protectiveCircle, wardingCircle:Arg4.value.wardingCircle, volume:Arg4.value.volume, bindingCost:Arg4.value.bindingCost, property:Arg4.value.property, propertyText:Arg4.value.propertyText, aspect:Arg4.value.aspect, brew:Arg4.value.brew, extended:Arg4.value.extended, prerequisites:{sex:(Arg4.value.prerequisites.sex == null ? undefined : $$toRE253136807[Arg4.value.prerequisites.sex]), race:(Arg4.value.prerequisites.race == null ? undefined : {id:Arg4.value.prerequisites.race.id.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.race.id.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.race.id.value]), active:Arg4.value.prerequisites.race.active}), culture:(Arg4.value.prerequisites.culture == null ? undefined : Arg4.value.prerequisites.culture.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.culture.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.culture.value])), pact:(Arg4.value.prerequisites.pact == null ? undefined : {category:Arg4.value.prerequisites.pact.category, domain:(Arg4.value.prerequisites.pact.domain == null ? undefined : Arg4.value.prerequisites.pact.domain.tag==="One"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisites.pact.domain.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.prerequisites.pact.domain.value])), level:Arg4.value.prerequisites.pact.level}), social:Arg4.value.prerequisites.social, primaryAttribute:Arg4.value.prerequisites.primaryAttribute, activatable:Arg4.value.prerequisites.activatable, activatableMultiEntry:Arg4.value.prerequisites.activatableMultiEntry, activatableMultiSelect:Arg4.value.prerequisites.activatableMultiSelect, increasable:Arg4.value.prerequisites.increasable, increasableMultiEntry:Arg4.value.prerequisites.increasableMultiEntry, levels:Arg4.value.prerequisites.levels}, prerequisitesText:Arg4.value.prerequisitesText, prerequisitesTextIndex:{sex:(Arg4.value.prerequisitesTextIndex.sex == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.sex) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.sex.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.sex]), race:(Arg4.value.prerequisitesTextIndex.race == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.race) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.race.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.race]), culture:(Arg4.value.prerequisitesTextIndex.culture == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.culture) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.culture.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.culture]), pact:(Arg4.value.prerequisitesTextIndex.pact == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.pact) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.pact.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.pact]), social:(Arg4.value.prerequisitesTextIndex.social == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.social) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.social.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.social]), primaryAttribute:(Arg4.value.prerequisitesTextIndex.primaryAttribute == null ? undefined : typeof(Arg4.value.prerequisitesTextIndex.primaryAttribute) === 'object'
    ? CreateBucklescriptBlock.__(0, [Arg4.value.prerequisitesTextIndex.primaryAttribute.value])
    : $$toRE159395820[Arg4.value.prerequisitesTextIndex.primaryAttribute]), activatable:Arg4.value.prerequisitesTextIndex.activatable, activatableMultiEntry:Arg4.value.prerequisitesTextIndex.activatableMultiEntry, activatableMultiSelect:Arg4.value.prerequisitesTextIndex.activatableMultiSelect, increasable:Arg4.value.prerequisitesTextIndex.increasable, increasableMultiEntry:Arg4.value.prerequisitesTextIndex.increasableMultiEntry, levels:Arg4.value.prerequisitesTextIndex.levels}, prerequisitesTextStart:Arg4.value.prerequisitesTextStart, prerequisitesTextEnd:Arg4.value.prerequisitesTextEnd, apValue:(Arg4.value.apValue == null ? undefined : Arg4.value.apValue.tag==="Flat"
    ? CreateBucklescriptBlock.__(0, [Arg4.value.apValue.value])
    : CreateBucklescriptBlock.__(1, [Arg4.value.apValue.value])), apValueText:Arg4.value.apValueText, apValueTextAppend:Arg4.value.apValueTextAppend, gr:Arg4.value.gr, subgr:Arg4.value.subgr, src:Arg4.value.src, errata:Arg4.value.errata}]), Arg5, Arg6);
  return result
};
