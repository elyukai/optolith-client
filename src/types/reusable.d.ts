export type SID = string | number | (string | number)[];

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
  value: string | string[];
}

export interface CultureRequirement {
  id: 'CULTURE';
  value: string | string[];
}

export type AllRequirementTypes = RequiresActivatableObject | RequiresIncreasableObject | RequiresPrimaryAttribute | SexRequirement | RaceRequirement | CultureRequirement;
