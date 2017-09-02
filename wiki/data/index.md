# Data Tables

## Usage

The property tables have 3 columns, each of them is explained in the following table.

column | type | description
:--- | :--- | :---
`name` | string | The table column header.
`occ` or `occurrence` | `all` or `data` or `l10n` | If the entry occurs in either only the data tables or only the localization tables or all tables.
`description` | string | What the column entries are used for and how they should be used. If a column is declared as **Optional**, it can be empty. Referenced JSON interfaces can be found in TypeScript syntax below the respective table.

If Markdown is used, use `\n` characters for line breaks. Also use the styles of the text you copy (like italic or bold texts and lists)!

## Term definitions

term | description
:--- | :---
`String ID` | The respective ID from the `id` column with a prefix. The specific prefix is mentioned in the `id` description in the table definition file.
`Numeric ID` | The plain ID integer from the `id` column.
`Selection-ID` or `SID` | Selections (like Trade Secrets, Languages or Hair Colors) do not have an ID prefix. To clarify that this ID is referenced to, the `SID` term is used. Mostly this ID is numeric-only, in case of skill lists the string ID of the respective entries is used as the SID.
`ID` | If the term `ID` is used without a `numeric` or `string` and refers to a list item that has a string ID, the string ID is meant. If the term is used to refer to an item in an array, the index of the item (imagine a 1-based index) is used as the ID.
`{{` ... `}}` | This might occur in a description for a scheme. If something is written between double curly brackets, insert what mentioned inside those brackets (replace **everything, including the outer curly brackets**, with the required value).

## Available definitions

- [Books](books.md)
- [Experience Levels](experienceLevels.md)
- [Races](races.md)
- [Cultures](cultures.md)
- [Professions](professions.md)
- [Profession Variants](professionVariants.md)
- [Advantages, Disadvantages and Special Abilities](activatables.md)
- [Trade Secrets](tradeSecrets.md)
- [Languages](languages.md)
- [Scripts](scripts.md)
- [Spell Extensions](spellExtensions.md)
- [Attributes](attributes.md)
- [Skills](skills.md)
- [Combat Techniques](combatTechniques.md)
- [Spells](spells.md)
- [Cantrips](cantrips.md)
- [Chants](chants.md)
- [Blessings](blessings.md)
- [Equipment](equipment.md)
