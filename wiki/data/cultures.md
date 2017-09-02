# Cultures

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `C_` prefix.
`name` | all | The name of the culture.
`ap` | data | The AP value you have to pay for the culture package.
`lang` | data | A list of native languages (usually it is only one). An array of language SIDs, separated by `&`.
`literacy` | data | **Optional:** A list of native scripts (usually it is only one). An array of script SIDs, separated by `&`. If the culture does not use any script, leave this field empty.
`social` | data | A list of possible social status in the respective culture. An array of social status SIDs, separated by `&`.
`typ_prof` | data | The list of common professions. An array containing the numeric profession IDs, separated by `&`.
`typ_adv` | data | **Optional:** A list of common advantages. An array of numeric advantage IDs, separated by `&`.
`typ_dadv` | data | **Optional:** A list of common disadvantages. An array of numeric disadvantage IDs, separated by `&`.
`untyp_adv` | data | **Optional:** A list of uncommon advantages. An array of numeric advantage IDs, separated by `&`.
`untyp_dadv` | data | **Optional:** A list of uncommon disadvantages. An array of numeric disadvantage IDs, separated by `&`.
`typ_talents` | data | A list of common skills. An array of numeric skill IDs, separated by `&`.
`untyp_talents` | data | **Optional:** A list of uncommon skills. An array of numeric skill IDs, separated by `&`.
`talents` | data | The skill values of the culture package. An array containing values according to scheme `{{Numeric Skill ID}}?{{VALUE}}`. If you buy the culture package, the VALUE will be added to the current skill's SR. VALUE must be a number.
