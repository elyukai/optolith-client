# Spells

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `SPELL_` prefix.
`name` | all | The full name.
`check` | data | The spell's check attributes. An array of 3 integers, separated by `&`. The integers represent the numeric attribute IDs.
`mod` | data | **Optional:** If the check is modified by Spirit or Toughness, insert `SPI` or `TOU` respectively, otherwise leave empty.
`skt` | data | Improvement cost. An integer; see table below.
`trad` | data | The tradition(s) the spell is available for. An array of integers, separated by `&`. The integers represent the tradition IDs; see below.
`merk` | data | The spell property ID; see below.
`gr` | data | The group ID.
`effect` | l10n | The effect description. A Markdown string.
`castingtime` | l10n | The cast range. A Markdown string.
`aecost` | l10n | The cast range. A Markdown string.
`range` | l10n | The cast range. A Markdown string.
`duration` | l10n | The effect duration. A Markdown string.
`target` | l10n | The target category. A Markdown string.
`src` | l10n | The source book(s) where you can find the entry. An array containing strings according to scheme `{{BOOK}}?{{PAGE}}` (BOOK is the book ID from the [Books table](books.md)), separated by `&`.

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
const de_DE = ["Spruch", "Ritual", "Fluch", "Lied"]
const en_US = ["Spell", "Ritual", "Curse", "Song"]
```

### Traditions Array

```ts
const de_DE = ["Allgemein", "Gildenmagier", "Hexen", "Elfen", "Druiden", "Scharlatane", "Zauberbarden", "Zaubertänzer", "Intuitive Zauberer", "Meistertalentierte", "Qabalyamagier", "Kristallomanten", "Geoden", "Alchimisten", "Schelme"]
const en_US = ["General", "Guild Mages", "Witches", "Elves", "Druids"]
```

### Spell Properties Array

```ts
const de_DE = ["Antimagie", "Dämonisch", "Einfluss", "Elementar", "Heilung", "Hellsicht", "Illusion", "Sphären", "Objekt", "Telekinese", "Verwandlung"]
const en_US = ["Anti-Magic", "Demonic", "Influence", "Elemental", "Healing", "Clairvoyance", "Illusion", "Spheres", "Objekt", "Telekinesis", "Transformation"]
```
