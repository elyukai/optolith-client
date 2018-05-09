export type SID = string | number | number[];

export interface ValueOptionalDependency {
  /**
   * The skill/spell/chant rating or rather attribute value.
   */
	value: number;
  /**
   * The entry that created this dependency.
   */
	origin: string;
}

export interface ActiveDependency {
	active?: boolean;
	sid?: SID;
	sid2?: string | number;
	tier?: number;
}

export interface ActiveOptionalDependency extends ActiveDependency {
	origin: string;
}

export interface RequiresActivatableObject {
  id: string | string[];
  active: boolean;
  sid?: SID;
  sid2?: string | number;
  tier?: number;
}

export interface ProfessionRequiresActivatableObject extends RequiresActivatableObject {
  id: string;
  sid?: string | number;
}

export interface RequiresIncreasableObject {
  id: string | string[];
  value: number;
}

export interface ProfessionRequiresIncreasableObject extends RequiresIncreasableObject {
  id: string;
}

export interface RequiresPrimaryAttribute {
  id: "ATTR_PRIMARY";
  value: number;
  type: 1 | 2;
}

export interface SexRequirement {
  id: 'SEX';
  value: 'm' | 'f';
}

export interface RaceRequirement {
  id: 'RACE';
  value: number | number[];
}

export interface CultureRequirement {
  id: 'CULTURE';
  value: number | number[];
}

export interface PactRequirement {
  id: 'PACT';
  category: number;
  domain?: number | number[];
  level?: number;
}

export type ProfessionDependency =
  SexRequirement |
  RaceRequirement |
  CultureRequirement;

export type AllRequirementTypes =
  RequiresActivatableObject |
  RequiresIncreasableObject |
  RequiresPrimaryAttribute |
  SexRequirement |
  RaceRequirement |
  CultureRequirement |
  PactRequirement;
