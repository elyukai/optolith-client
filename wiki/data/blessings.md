# Blessings

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `BLESSING_` prefix.
`name` | all | The full name.
`trad` | data | The tradition(s) the chant is available for. An array of integers, separated by `&`. The integers represent the tradition IDs; see below.
`aspc` | data | The aspect(s) of the tradition(s) the chant is part of. An array of integers, separated by `&`. The integers represent the aspect IDs; see below.
`req` | data | The list of requirements. See [Advantages, Disadvantages and Special Abilities](activatables.md) for details (the `req` column in that table is working exactly the same).

## Special ID Tables

### Traditions Array

```ts
const de_DE = ["Allgemein", "Praioskirche", "Rondrakirche", "Boronkirche", "Hesindekirche", "Phexkirche", "Perainekirche"]
const en_US = ["General", "Church of Praios", "Church of Rondra", "Church of Boron", "Church of Hesinde", "Church of Phex", "Church of Peraine"]
```

### Aspects Array

```ts
const de_DE = ["Allgemein", "Antimagie", "Ordnung", "Schild", "Sturm", "Tod", "Traum", "Magie", "Wissen", "Handel", "Schatten", "Heilung", "Landwirtschaft"]
const en_US = ["General", "Anti-Magic", "Order", "Shield", "Storm", "Death", "Dream", "Magic", "Knowledge", "Commerce", "Shadow", "Healing", "Agriculture"]
```
