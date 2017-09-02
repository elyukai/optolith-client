# Races

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `R_` prefix.
`name` | all | The name of the race.
`ap` | data | The AP value you have to pay.
`le` | data | The LP base stat.
`sk` | data | The SPI base stat.
`zk` | data | The TOU base stat.
`gs` | data | The MOV base stat.
`attr` | data | **Optional:** An array of attribute maximum modifiers. The VALUE will be added to the current maximum of the specified attribute (negative values will lower the maximum). The modifiers are written according to scheme `{{VALUE}}?{{Numeric ID of the Attribute}}`. `&` is the array separator.
`attr_sel` | data | Used if the user has to choose between different modifiers. The VALUE will be added to the current maximum (negative values will lower the maximum). It is an entry according to scheme `{{VALUE}}?{{Array of numeric Attribute IDs}}`. The IDs are separated by `&`.
`typ_cultures` | data | The list of common cultures. An array containing the numeric culture IDs, separated by `&`.
`auto_adv` | data | **Optional:** A list of automatic applied advantages. An array of numeric advantage IDs, separated by `&`.
`autoAdvCost` | data | An array of three integers, representing the total/magic/karmal AP for the `auto_adv` property and separated by `&`. If auto_adv is not used, insert `0&0&0`.
`imp_adv` | data | **Optional:** A list of important advantages. An array of numeric advantage IDs, separated by `&`.
`imp_dadv` | data | **Optional:** A list of important disadvantages. An array of numeric disadvantage IDs, separated by `&`.
`typ_adv` | data | **Optional:** A list of common advantages. An array of numeric advantage IDs, separated by `&`.
`typ_dadv` | data | **Optional:** A list of common disadvantages. An array of numeric disadvantage IDs, separated by `&`.
`untyp_adv` | data | **Optional:** A list of uncommon advantages. An array of numeric advantage IDs, separated by `&`.
`untyp_dadv` | data | **Optional:** A list of uncommon disadvantages. An array of numeric disadvantage IDs, separated by `&`.
`hair` | data | The list of hair colors. An array containing 20 (numeric) hair color SIDs. The array also represents the 20-sided die for a random hair color, so there MUST be 20 entries available. You can find all the available hair colors in the l10n JSON files. They are represented as an array; to get the ID you have to get the index of the hair color in the array (imagine the first element had an index of 1, the second one an index of 2 and so on).
`eyes` | data | The list of eye colors. An array containing 20 (numeric) eye color SIDs. The array also represents the 20-sided die for a random eye color, so there MUST be 20 entries available. You can find all the available eye colors in the l10n JSON files. They are represented as an array; to get the ID you have to get the index of the hair color in the array (imagine the first element had an index of 1, the second one an index of 2 and so on).
`size` | data | Used for random size. An array. The first entry contains the base value, all following entries are for dice according to scheme `{{AMOUNT}}W{{SIDES}}`, e.g. `2W6`. The entries are separated by `&`.
`weight` | data | Used for random weight. An array. The first entry contains the base value (the size subtrahent; in the case of `Size - 110 + 2W6` it is `110`), all following entries are for dice according to scheme `{{AMOUNT}}W{{SIDES}}`, e.g. `2W6`. The entries are separated by `&`.
