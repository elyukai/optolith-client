# Skills

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer. The respective string ID will have the `TAL_` prefix.
`name` | all | The full name.
`spec` | l10n | A list of selections. An array of entries according to scheme `{{SID}}?{{NAME}}`, separated by `&&`.
`spec_input` | l10n | **Optional:** If there are options available that can not be put into a selection list (like different cults), provide the placeholder text for the input element here. Otherwise leave empty.
`check` | data | The skill's check attributes. An array of 3 integers, separated by `&`. The integers represent the numeric attribute IDs.
`skt` | data | Improvement cost. An integer; see table below.
`be` | data | If the skill check is modified by encumbrance tier or not or just under certain circumstances. Possible values are `true`, `false` and `maybe`.
`gr` | data | The group ID.
`tools` | l10n | Necessary equipment to employ the skill. A Markdown string.
`quality` | l10n | Examples of effects QL provides. A Markdown string.
`failed` | l10n | Examples of effects for failure. A Markdown string.
`critical` | l10n | Examples of effects for critical success. A Markdown string.
`botch` | l10n | Examples of effects for botch. A Markdown string.
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
const de_DE = ["Körper", "Gesellschaft", "Natur", "Wissen", "Handwerk"]
const en_US = ["Physical", "Social", "Nature", "Knowledge", "Craft"]
```
