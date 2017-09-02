# Chants

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `LITURGY_` prefix.
`name` | all | The full name.
`check` | data | The chant's check attributes. An array of 3 integers, separated by `&`. The integers represent the numeric attribute IDs.
`mod` | data | **Optional:** If the check is modified by Spirit or Toughness, insert `SPI` or `TOU` respectively, otherwise leave empty.
`skt` | data | Improvement cost. An integer; see table below.
`trad` | data | The tradition(s) the chant is available for. An array of integers, separated by `&`. The integers represent the tradition IDs; see below.
`aspc` | data | The aspect(s) of the tradition(s) the chant is part of. An array of integers, separated by `&`. The integers represent the aspect IDs; see below.
`gr` | data | The group ID.

## Special ID Tables

### Improvement Costs

id | name
:--- | :---
`1` | A
`2` | B
`3` | C
`4` | D

### Groups Array

```ts
const de_DE = ["Liturgie", "Zeremonie"]
const en_US = ["Spell", "Ritual", "Curse", "Song"]
```

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
