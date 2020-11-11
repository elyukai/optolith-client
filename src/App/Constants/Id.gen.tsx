/* TypeScript file generated from Id.re by genType. */
/* eslint-disable import/first */


// tslint:disable-next-line:interface-over-type-literal
export type t = 
    { NAME: "ExperienceLevel"; VAL: number }
  | { NAME: "Race"; VAL: number }
  | { NAME: "Culture"; VAL: number }
  | { NAME: "Profession"; VAL: number }
  | { NAME: "Attribute"; VAL: number }
  | { NAME: "Advantage"; VAL: number }
  | { NAME: "Disadvantage"; VAL: number }
  | { NAME: "Skill"; VAL: number }
  | { NAME: "CombatTechnique"; VAL: number }
  | { NAME: "Spell"; VAL: number }
  | { NAME: "Curse"; VAL: number }
  | { NAME: "ElvenMagicalSong"; VAL: number }
  | { NAME: "DominationRitual"; VAL: number }
  | { NAME: "MagicalMelody"; VAL: number }
  | { NAME: "MagicalDance"; VAL: number }
  | { NAME: "RogueSpell"; VAL: number }
  | { NAME: "AnimistForce"; VAL: number }
  | { NAME: "GeodeRitual"; VAL: number }
  | { NAME: "ZibiljaRitual"; VAL: number }
  | { NAME: "Cantrip"; VAL: number }
  | { NAME: "LiturgicalChant"; VAL: number }
  | { NAME: "Blessing"; VAL: number }
  | { NAME: "SpecialAbility"; VAL: number }
  | { NAME: "Item"; VAL: number }
  | { NAME: "EquipmentPackage"; VAL: number }
  | { NAME: "HitZoneArmor"; VAL: number }
  | { NAME: "Familiar"; VAL: number }
  | { NAME: "Animal"; VAL: number }
  | { NAME: "FocusRule"; VAL: number }
  | { NAME: "OptionalRule"; VAL: number }
  | { NAME: "Condition"; VAL: number }
  | { NAME: "State"; VAL: number };
export type Id = t;

// tslint:disable-next-line:interface-over-type-literal
export type activatable = 
    { NAME: "Advantage"; VAL: number }
  | { NAME: "Disadvantage"; VAL: number }
  | { NAME: "SpecialAbility"; VAL: number };
export type ActivatableId = activatable;

// tslint:disable-next-line:interface-over-type-literal
export type activatableAndSkill = 
    { NAME: "Advantage"; VAL: number }
  | { NAME: "Disadvantage"; VAL: number }
  | { NAME: "SpecialAbility"; VAL: number }
  | { NAME: "Spell"; VAL: number }
  | { NAME: "LiturgicalChant"; VAL: number };
export type ActivatableAndSkillId = activatableAndSkill;

// tslint:disable-next-line:interface-over-type-literal
export type activatableSkill = 
    { NAME: "Spell"; VAL: number }
  | { NAME: "LiturgicalChant"; VAL: number };
export type ActivatableSkillId = activatableSkill;

// tslint:disable-next-line:interface-over-type-literal
export type permanentSkill = 
    { NAME: "Skill"; VAL: number }
  | { NAME: "CombatTechnique"; VAL: number };
export type PermanentSkillId = permanentSkill;

// tslint:disable-next-line:interface-over-type-literal
export type selectOption = 
    { NAME: "Generic"; VAL: number }
  | { NAME: "Skill"; VAL: number }
  | { NAME: "CombatTechnique"; VAL: number }
  | { NAME: "Spell"; VAL: number }
  | { NAME: "Cantrip"; VAL: number }
  | { NAME: "LiturgicalChant"; VAL: number }
  | { NAME: "Blessing"; VAL: number };
export type SelectOptionId = selectOption;

// tslint:disable-next-line:interface-over-type-literal
export type hitZoneArmorZoneItem = 
    { tag: "Template"; value: number }
  | { tag: "Custom"; value: number };
export type HitZoneArmorZoneItemId = hitZoneArmorZoneItem;

// tslint:disable-next-line:interface-over-type-literal
export type phase = "Outline" | "Definition" | "Advancement";
export type Phase = phase;
