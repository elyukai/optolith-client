# Profession Variants

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `PV_` prefix.
`name` | all | The name of the profession. If the language differenciates between male and female versions of the name, this field will contain the male version.
`name_f` | l10n | **Optional:** The female version of the `name` field. If the female version equals the male version, you can leave this field empty.
`ap` | data | The AP value you have to pay for the package. This value will be added to the AP costs of the base profession.
`pre_req` | data | **Optional:** A list of requirements that has to be met before selecting the profession. An array of JSON objects, separated by `&`. Following interfaces may be used for entries: `SexRequirement`, `RaceRequirement` and `CultureRequirement`. Entries will overwrite existing entries with the same `id` property.
`req` | data | **Optional:** A list of requirements that has to be met after selecting the profession. An array of JSON objects, separated by `&`. Following interfaces may be used for entries: `ProfessionActivatableObject` and `ProfessionIncreasableObject`. The listed entries will be bought once RCP selection is confirmed. Entries will overwrite existing entries with the same `id` property.
`sel` | data | **Optional:** A list of selections. An array of JSON objects, separated by `&`. Following interfaces may be used for entries: `SpecialisationSelection`, `LanguagesScriptsSelection`, `CombatTechniquesSelection`, `CombatTechniquesSecondSelection`, `CantripsSelection` and `CursesSelection`. `CombatTechniquesSecondSelection` must not be used if `CombatTechniquesSelection` is not used. The active property may be used: If it is `false`, the entry with the respective ID will be excluded from the profession package. If you want this you will have to specify the `id` property only. Entries will overwrite existing entries with the same `id` property.
`sa` | data | **Optional:** The list of special abilties contained in the profession package. An array containing the internal respresentations of the active entries in JSON format, separated by `&`. The `ProfessionActivatableObject` interface is used for all the entries.
`combattech` | data | **Optional:** The combat technique values of the profession package. An array containing values according to scheme `{{Numeric Combat Technique ID}}?{{VALUE}}`. If you buy the profession package, the VALUE will be added to the current combat technique's CTR. VALUE must be a number.
`talents` | data | **Optional:** The skill values of the profession package. An array containing values according to scheme `{{Numeric Skill ID}}?{{VALUE}}`. If you buy the profession package, the VALUE will be added to the current skill's SR. VALUE must be a number.
`spells` | data | **Optional:** The spell values of the profession package. An array containing values according to scheme `{{Numeric Spell ID}}?{{VALUE}}`. If you buy the profession package, the VALUE will be added to the current spell's SR. VALUE must be a number.

## Interfaces

```ts
interface ProfessionActivatableObject {
  id: string;
  active: boolean;
  sid?: string | number;
  sid2?: string | number;
  tier?: number;
}

interface ProfessionIncreasableObject {
  id: string;
  value: number; // skill/combat technique has to have this specific SR/CTR after RCP selection
}

interface SexRequirement {
  id: 'SEX';
  value: 'm' | 'f';
}

interface RaceRequirement {
  id: 'RACE';
  value: number | number[]; // Either specified numeric race ID or array containing numeric race IDs (one-of)
}

interface CultureRequirement {
  id: 'CULTURE';
  value: number | number[]; // Either specified numeric culture ID or array containing numeric culture IDs (one-of)
}

interface SpecialisationSelection {
  id: 'SPECIALISATION';
  active?: boolean;
  sid: string | string[]; // A skill ID or an array of skill IDs. If it is an array, the user can choose between the different skills.
}

interface LanguagesScriptsSelection {
  id: 'LANGUAGES_SCRIPTS';
  active?: boolean;
  value: number; // AP
}

interface CombatTechniquesSelection {
  id: 'COMBAT_TECHNIQUES';
  active?: boolean;
  amount: number; // Number of selectable CTs
  value: number; // The value by which the CTs will be increased (The base CTR is 6, to get e.g. a CTR of 8, "value" equals 2)
  sid: string[]; // An array containing the combat technique IDs
}

interface CombatTechniquesSecondSelection {
  id: 'COMBAT_TECHNIQUES_SECOND';
  active?: boolean;
  amount: number; // Number of selectable CTs
  value: number; // The value by which the CTs will be increased (The base CTR is 6, to get e.g. a CTR of 8, "value" equals 2)
  sid: string[]; // An array containing the combat technique IDs
}

interface CantripsSelection {
  id: 'CANTRIPS';
  active?: boolean;
  amount: number; // Number of selectable cantrips
  sid: string[]; // An array containing the cantrip IDs
}

interface CursesSelection {
  id: 'CURSES';
  active?: boolean;
  value: number; // Total number of activations and/or increases.
}
```
