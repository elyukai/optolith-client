# Professions

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `P_` prefix.
`name` | all | The name of the profession. If the language differenciates between male and female versions of the name, this field will contain the male version.
`name_f` | l10n | **Optional:** The female version of the `name` field. If the female version equals the male version, you can leave this field empty.
`subname` | l10n | **Optional:** A name addition of the profession. This will contain texts like name of the academy of the witch circle. If the langauge differenciates between male and female versions of the name, this field will contain the male version.
`subname_f` | l10n | **Optional:** The female version of the `subname` field. If the female version equals the male version, you can leave this field empty.
`ap` | data | The AP value you have to pay for the package.
`pre_req` | data | **Optional:** A list of requirements that has to be met before selecting the profession. An array of JSON objects, separated by `&`. Following interfaces may be used for entries: `SexRequirement`, `RaceRequirement` and `CultureRequirement`.
`req` | all | **Optional:** A list of requirements that has to be met after selecting the profession. An array of JSON objects, separated by `&`. Following interfaces may be used for entries: `ProfessionActivatableObject` and `ProfessionIncreasableObject`. The listed entries will be bought once RCP selection is confirmed.
`sel` | data | **Optional:** A list of selections. An array of JSON objects, separated by `&`. Following interfaces may be used for entries: `SpecialisationSelection`, `LanguagesScriptsSelection`, `CombatTechniquesSelection`, `CombatTechniquesSecondSelection`, `CantripsSelection` and `CursesSelection`. `CombatTechniquesSecondSelection` must not be used if `CombatTechniquesSelection` is not used.
`sa` | data | **Optional:** The list of special abilties contained in the profession package. An array containing the internal respresentations of the active entries in JSON format, separated by `&`. The `ProfessionActivatableObject` interface is used for all the entries.
`combattech` | data | **Optional:** The combat technique values of the profession package. An array containing values according to scheme `{{Numeric Combat Technique ID}}?{{VALUE}}`. If you buy the profession package, the VALUE will be added to the current combat technique's CTR. VALUE must be a number.
`talents` | data | **Optional:** The skill values of the profession package. An array containing values according to scheme `{{Numeric Skill ID}}?{{VALUE}}`. If you buy the profession package, the VALUE will be added to the current skill's SR. VALUE must be a number.
`spells` | data | **Optional:** The spell values of the profession package. An array containing values according to scheme `{{Numeric Spell ID}}?{{VALUE}}`. If you buy the profession package, the VALUE will be added to the current spell's SR. VALUE must be a number.
`chants` | data | **Optional:** The chant values of the profession package. An array containing values according to scheme `{{Numeric Chant ID}}?{{VALUE}}`. If you buy the profession package, the VALUE will be added to the current chant's SR. VALUE must be a number.
`blessings` | data | **Optional:** The list of blessings to activate for the profession package. An array containing the numeric blessing IDs, separated by `&`.
`typ_adv` | data | **Optional:** A list of common advantages. An array of numeric advantage IDs, separated by `&`.
`typ_dadv` | data | **Optional:** A list of common disadvantages. An array of numeric disadvantage IDs, separated by `&`.
`untyp_adv` | data | **Optional:** A list of uncommon advantages. An array of numeric advantage IDs, separated by `&`.
`untyp_dadv` | data | **Optional:** A list of uncommon disadvantages. An array of numeric disadvantage IDs, separated by `&`.
`vars` | data | **Optional:** A list of available profession variants. An array of numeric profession variant IDs, separated by `&`.
`gr` | data | The profession group. See table below.
`sgr` | data | A subgroup of the `gr` field. See table below.
`src` | all | The source book where you can find the entry. In the data table this field contains the book ID (from the [Books table](./books.md)), in a l10n table this field contains the page number of the book specified in the data table.

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
  sid: string | string[]; // A skill ID or an array of skill IDs. If it is an array, the user can choose between the different skills.
}

interface LanguagesScriptsSelection {
  id: 'LANGUAGES_SCRIPTS';
  value: number; // AP
}

interface CombatTechniquesSelection {
  id: 'COMBAT_TECHNIQUES';
  amount: number; // Number of selectable CTs
  value: number; // The value by which the CTs will be increased (The base CTR is 6, to get e.g. a CTR of 8, "value" equals 2)
  sid: string[]; // An array containing the combat technique IDs
}

interface CombatTechniquesSecondSelection {
  id: 'COMBAT_TECHNIQUES_SECOND';
  amount: number; // Number of selectable CTs
  value: number; // The value by which the CTs will be increased (The base CTR is 6, to get e.g. a CTR of 8, "value" equals 2)
  sid: string[]; // An array containing the combat technique IDs
}

interface CantripsSelection {
  id: 'CANTRIPS';
  amount: number; // Number of selectable cantrips
  sid: string[]; // An array containing the cantrip IDs
}

interface CursesSelection {
  id: 'CURSES';
  value: number; // Total number of activations and/or increases.
}
```

## Special ID Tables

### Profession Groups

id | name
:--- | :---
`1` | Mundane
`2` | Magical
`3` | Blessed

### Profession Subgroups

The `gr` column represents the profession group ID.

id | gr | name
:--- | :--- | :---
`1` | `1` | Non-fighters
`2` | `1` | Fighters
`1` | `2` | Mages
`2` | `2` | Witches
`3` | `2` | Elves
`1` | `3` | Blessed Ones of the Twelve Gods
