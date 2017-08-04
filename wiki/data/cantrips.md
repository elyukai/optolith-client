# Cantrips

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `CANTRIP_` prefix.
`name` | all | The full name.
`trad` | data | The tradition(s) the cantrip is available for. An array of integers, separated by `&`. The integers represent the tradition IDs; see below.
`merk` | data | The cantrip property ID; see below.
`req` | data | The list of requirements. See [Advantages, Disadvantages and Special Abilities](activatables.md) for details (the `req` column in that table is working exactly the same).
`effect` | l10n | The effect description. A Markdown string.
`range` | l10n | The cast range. A Markdown string.
`duration` | l10n | The effect duration. A Markdown string.
`target` | l10n | The target category. A Markdown string.
`src` | l10n | The source book(s) where you can find the entry. An array containing strings according to scheme `{{BOOK}}?{{PAGE}}` (BOOK is the book ID from the [Books table](books.md)), separated by `&`.

## Special ID Tables

### Traditions Array

```ts
const de_DE = ["Allgemein", "Gildenmagier", "Hexen", "Elfen", "Druiden", "Scharlatane", "Zauberbarden", "Zaubertänzer", "Intuitive Zauberer", "Meistertalentierte", "Qabalyamagier", "Kristallomanten", "Geoden", "Alchimisten", "Schelme"]
const en_US = ["General", "Guild Mages", "Witches", "Elves", "Druids"]
```

### Cantrip Properties Array

```ts
const de_DE = ["Antimagie", "Dämonisch", "Einfluss", "Elementar", "Heilung", "Hellsicht", "Illusion", "Sphären", "Objekt", "Telekinese", "Verwandlung"]
const en_US = ["Anti-Magic", "Demonic", "Influence", "Elemental", "Healing", "Clairvoyance", "Illusion", "Spheres", "Object", "Telekinesis", "Transformation"]
```
