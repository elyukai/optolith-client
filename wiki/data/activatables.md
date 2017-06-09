# Advantages, Disadvantages and Special Abilities

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `ADV_` prefix for advantages, `DISADV_` for disadvantages and `SA_` for special abilities.
`name` | all | The name of the entry.
`ap` | data | The AP value you have to pay for it. If the AP costs depend on the selection, insert `sel`. If the AP costs depend on the selected skill's improvement cost, insert an array of numbers, separated by `&`. The first entry represents A, the second B and so on. _Always_ start from A. If there is no AP value given, type `0`. If you use an array, contact the depeloper, this has to be implemented manually.
`tiers` | data | **Optional:** Number of available tiers. An integer.
`max` | data | **Optional:** The number of possible activations. An empty field sets no limit. You will also have to set no limit if the number of activations is limited to the available selection. If you have to use this, you will have to contact the developer; is has to be implemented separately.
`sel` | all | **Optional:** A list of selections. An array of entries according to scheme `{{SID}}?{{NAME}}`, separated by `&`, in the **l10n files**. If you need different AP cost values, use scheme `{{SID}}?{{NAME}}?{{AP}}` in the **data table**. You can also use one or more of the category IDs from the table below. You have to separate them by `&`, too. You can not mix category IDs and selection schemes. If you use the category IDs, all available entries from the specified category/ies will be included as separate selection items. Include the category ID array in the data table instead of the l10n tables.
`input` | l10n | **Optional:** A string that is used as a placeholder text for an input field.
`req` | data | **Optional:** A list of requirements that has to be met before activation availability. An array of JSON objects, separated by `&`. Following interfaces may be used for entries: `RequiresActivatableObject`, `RequiresIncreasableObject`, `RequiresPrimaryAttribute`, `SexRequirement`, `RaceRequirement` and `CultureRequirement`. You can also use `RCP` to indicate that it has to be recommended by or common in the selected race, culture or profession.
`gr` | data | **Special Abilities Only:** The group ID.
`type` | data | **Combat Special Abilties Only:** Type of the combat special ability. `p` for passive, `b` for basic maneuvers and `s` for special maneuvers.
`rules` | l10n | **Optional:** The rule text. A Markdown string.
`effect` | l10n | **Optional** The effect description. A Markdown string.
`penalty` | l10n | **Optional** The given penalty. A Markdown string.
`ct` | l10n | **Optional:** Applicable combat techniques. A Markdown string.
`aecost` | l10n | **Optional:** The AE Cost. An integer.
`protective` | l10n | **Optional:** The rules for the protective circle. A Markdown string.
`warding` | l10n | **Optional:** The rules for the warding circle. A Markdown string.
`volume` | l10n | **Optional:** The volume points the enchantment needs. An integer.
`bindingcost` | l10n | **Optional:** The binding cost for an enchantment. An integer.
`property` | l10n | **Optional:** The magic property. An integer; see [Spells](spells.md) for the properties array to get the ID.
`apvalue` | l10n | **Optional:** The AP value. Only use this if the text provides different information than `X adventure points`, e.g. for Special Ability Property Knowledge it is "10 adventure points for the first _Property Knowledge_, 20 adventure points for the second, 40 adventure points for the third".
`src` | l10n | The source book(s) where you can find the entry. An array containing strings according to scheme `{{BOOK}}?{{PAGE}}` (BOOK is the book ID from the [Books table](books.md)), separated by `&`.

## Interfaces

```ts
interface RequiresActivatableObject {
  id: string | string[]; // If an array is used, only one of the specified IDs has to fit the other object properties. Can not be used, if the 'sid' property is an array.
  active: boolean; // if the specified object with its properties has to be active or deactive.
  sid?: string | number | string[] | number[]; // If an array is used, only one of the specified SIDs has to fit the other object properties. Can not be used, if the 'id' property is an array.
  sid2?: string | number;
  tier?: number;
}

interface RequiresIncreasableObject {
  id: string | string[];
  value: number; // skill/combat technique has to have this specific SR/CTR
}

interface RequiresPrimaryAttribute {
  id: "ATTR_PRIMARY";
  value: number;
  type: 1 | 2; // 1 => magic, 2 => blessed
}

interface SexRequirement {
  id: 'SEX';
  value: 'm' | 'f';
}

interface RaceRequirement {
  id: 'RACE';
  value: string | string[]; // Either specified race ID or array containing race IDs (one-of)
}

interface CultureRequirement {
  id: 'CULTURE';
  value: string | string[]; // Either specified culture ID or array containing culture IDs (one-of)
}
```

## Special ID Tables

### Category Table

id | description
:--- | :---
`TALENTS` | All skills.
`COMBAT_TECHNIQUES` | All combat techniques.
`SPELLS` | All spells (excluding cantrips).
`LITURGIES` | All chants (excluding blessings).

### Special Ability Groups Array

```ts
const de_DE = ["Allgemein", "Schicksal", "Kampf", "Magisch", "Magisch (Stab)", "Magisch (Hexe)", "Geweiht", "Magisch (Bann-/Schutzkreis)", "Kampfstil (bewaffnet)", "Kampfstil (unbewaffnet)", "Kampf (erweitert)", "Befehl", "Zauberstil", "Magisch (Erweitert)", "Magisch (Bannschwert)", "Magisch (Dolch)", "Magisch (Instrument)", "Magisch (Gewand)", "Magisch (Kugel)", "Magisch (Stecken)"]
const en_US = ["General", "Fate", "Combat", "Magical", "Magical (Staff)", "Magical (Witch)", "Karma", "Magical (Protective/Warding Circles)", "Combat Style (armed)", "Combat Style (unarmed)", "Combat (extended)"]
```

## Notes

- `DISADV_34` and `DISADV_50`: The selection list needs to be filtered by the selected tier. To archieve that, a list of selection items will be included in the data table, containing the property `tier`. The current list for that is specified in a separate JSON file, which will be included manually after converting the table to app-readable JSON.
- `SA_3`: The selection list is included in the separate worksheet `TradeSecr`. This will be included manually after converting the table and the selection list to app-readable JSON.
- `SA_10`: The skills list will be included in the initialization phase of the app.
- `SA_28`: The selection list is included in the separate worksheet `Scripts`. This will be included manually after converting the table and the selection list to app-readable JSON.
- `SA_29`: The selection list items need to meet specified SR requirements. To archieve that, a list of selection items will be included in the data table, containing the property `talent`, which has the type `[string, number]`. The string is the skill ID, the number the required SR. The current list for that is specified in a separate JSON file, which will be included manually after converting the table to app-readable JSON.
- `SA_30`: The selection list is included in the separate worksheet `Languages`. This will be included manually after converting the table and the selection list to app-readable JSON.
- `SA_183` and `SA_293`: The requirements are entirely maintained by the app.
- `SA_368`: The selection list items need to meet specified requirements. To archieve that, a list of selection items will be included in the data table, containing the properties `cost`, `gr` and `tier`, all of type `number`. `cost` specifies the AP cost, `gr` the groups of animals that belong together and `tier` the order of animals in a group. The current list for that is specified in a separate JSON file, which will be included manually after converting the table to app-readable JSON.
- `SA_484`: The selection list is included in the separate worksheet `SpellX`. This will be included manually after converting the table and the selection list to app-readable JSON.
