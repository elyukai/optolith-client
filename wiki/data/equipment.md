# Equipment

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `ITEMTPL_` prefix.
`name` | all | The full name.
`price` | data | **Optional:** The price in silverthalers.
`weight` | data | **Optional:** The weight in kg.
`gr` | data | The group ID.
`ct` | data | **Weapons Only:** The numeric combat technique ID.
`ddn` | data | **Melee Weapons Only:** Number of dice for damage. An integer.
`dds` | data | **Melee Weapons Only:** Number of dice's sides. An integer.
`df` | data | **Melee Weapons Only:** Flat damage. An integer.
`db` | data | **Melee Weapons Only:** The primary attribute value for calculating the damage bonus. An integer.
`at` | data | **Melee Weapons Only:** The AT modifier. An integer.
`pa` | data | **Melee Weapons Only:** The PA modifier. An integer.
`re` | data | **Melee Weapons Only:** The reach of the weapon. `1` for short, `2` for medium and `3` for long.
`length` | data | **Weapons Only:** The length of the weapon. An integer.
`stp` | data | **Shields/Non-Weapon-and-Armor Only:** The Structure Points. An integer.
`range` | data | **Ranged Weapons Only:** The range brackets for the weapon. An array with 3 integers, respresenting the distance in m, separated by `&`.
`rt` | data | **Ranged Weapons Only:** The reload time. An integer.
`am` | data | **Optional: Ranged Weapons Only:** The needed ammunition. The numeric item ID (from this table).
`pro` | data | **Armor Only:** The PRO value. An integer.
`enc` | data | **Armor Only:** The ENC value. An integer.
`addp` | data | **Optional: Armor Only:** Insert `TRUE` if the armor has additional penalties (MOV -1, INI -1). Otherwise leave empty.
`armty` | data | **Armor Only:** The armor type ID. See table below.
`pryw` | data | **Optional: Melee Weapons Only:** Insert `TRUE` if the weapon is a parrying weapon. Otherwise leave empty.
`two` | data | **Optional: Melee Weapons Only:** Insert `TRUE` if the weapon is a two-handed weapon. Otherwise leave empty.
`imp` | data | **Optional: Non-Weapon-and-Armor Only**: If the item can be used as an improvised weapon, insert the group ID for the weapon, e.g. `1` if it is a improvised melee weapon (`1` and `2` are valid values). You also have to fill out the needed fields for the respective weapon type!

## Special ID Tables

### Groups Array

```ts
const de_DE = ["Nahkampfwaffen", "Fernkampfwaffen", "Munition", "Rüstungen", "Waffenzubehör", "Kleidung", "Reisebedarf und Werkzeuge", "Beleuchtung", "Verbandzeug und Heilmittel", "Behältnisse", "Seile und Ketten", "Diebeswerkzeug", "Handwerkszeug", "Orientierungshilfen", "Schmuck", "Edelsteine und Feingestein", "Schreibwaren", "Bücher", "Magische Artefakte", "Alchimica", "Gifte", "Heilkräuter", "Musikinstrumente", "Genussmittel und Luxus", "Tiere", "Tierbedarf", "Fortbewegungsmittel"]
const en_US = ["Melee Weapons", "Ranged Weapons", "Ammunition", "Armor", "Weapon Accessories", "Clothes", "Travel Gear and Tools", "Illumination", "Bandages and Remedies", "Containers", "Ropes and Chains", "Thieves' Tools", "Tools of the Trade", "Orienteering Aids", "Jewelry", "Gems and Precious Stones", "Stationary", "Books", "Magical Artifacts", "Alchemicae", "Poisons", "Healing Herbs", "Musical Instruments", "Luxury Goods", "Animals", "Animal Care", "Vehicles"]
```

### Armor Types

id | name
:--- | :---
`1` | Normal clothing
`2` | Heavy clothing
`3` | Cloth armor
`4` | Leather armor
`5` | Wood armor
`6` | Chain armor
`7` | Scale armor
`8` | Plate armor
`9` | Jousting armor
