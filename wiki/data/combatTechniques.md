# Advantages, Disadvantages and Special Abilities

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `CT_` prefix.
`name` | all | The full name.
`skt` | data | Improvement cost. An integer; see table below.
`leit` | data | The primary attribute(s). An array of integers, separated by `&`. The integers represent the numeric attribute IDs.
`bf` | data | The "Bruchfaktor" (translation missing) of the respective combat technique.
`gr` | data | The group ID.

## Special ID Tables

### Improvement Costs

id | name
:--- | :---
`2` | B
`3` | C

### Groups Array

```ts
const de_DE = ["Nahkampf", "Fernkampf"]
const en_US = ["Melee", "Ranged"]
```
