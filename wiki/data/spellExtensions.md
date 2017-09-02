# Spell Extensions

## Properties

name | occ | description
:--- | :--- | :---
`id` | all | An increasing integer.
`name` | all | The full name.
`target` | data | The spell the extension belongs to.
`tier` | data | Insert `1` for a required SR of `8`, `2` for `12` and `3` for `16`.
`req` | data | The list of requirements. See [Advantages, Disadvantages and Special Abilities](activatables.md) for details (the `req` column in that table is working exactly the same). **Do not** include the target spell, this will be handled automatically!
`cost` | data | The AP value you have to pay for it.
