module NameBySex = {
  type t = {
    m: string,
    f: string,
  };
};

module IncreaseSkillList = {
  type t = {
    id: list(string),
    value: int,
  };
};

type name =
  | Const(string)
  | BySex(NameBySex.t);

type skillIncrease =
  | Flat(Culture.IncreaseSkill.t)
  | Selection(IncreaseSkillList.t);

module Variant = {
  type t = {
    id: string,
    name,
    ap: int,
    prerequisites: Prerequisites.tProfession,
    selections: ProfessionSelectOptions.tForVariant,
    specialAbilities: list(Prerequisites.ActivatablePrerequisite.t),
    combatTechniques: list(Culture.IncreaseSkill.t),
    skills: list(Culture.IncreaseSkill.t),
    spells: list(skillIncrease),
    liturgicalChants: list(skillIncrease),
    blessings: list(string),
    precedingText: option(string),
    fullText: option(string),
    concludingText: option(string),
    errata: list(Erratum.t),
  };
};

type t = {
  id: string,
  name,
  subname: option(name),
  ap: option(int),
  prerequisites: Prerequisites.tProfession,
  prerequisitesStart: option(string),
  prerequisitesEnd: option(string),
  selections: ProfessionSelectOptions.t,
  specialAbilities: list(Prerequisites.ActivatablePrerequisite.t),
  combatTechniques: list(Culture.IncreaseSkill.t),
  skills: list(Culture.IncreaseSkill.t),
  spells: list(skillIncrease),
  liturgicalChants: list(skillIncrease),
  blessings: list(string),
  suggestedAdvantages: list(string),
  suggestedAdvantagesText: option(string),
  suggestedDisadvantages: list(string),
  suggestedDisadvantagesText: option(string),
  unsuitableAdvantages: list(string),
  unsuitableAdvantagesText: option(string),
  unsuitableDisadvantages: list(string),
  unsuitableDisadvantagesText: option(string),
  isVariantRequired: bool,
  variants: list(Variant.t),
  gr: int,
  /**
   * Divides the groups into smaller subgroups, e.g. "Mage", "Blessed One of the
   * Twelve Gods" or "Fighter".
   */
  subgr: int,
  src: list(SourceRef.t),
  errata: list(Erratum.t),
};
