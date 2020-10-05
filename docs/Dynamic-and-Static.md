# *Dynamic* and *Static*

In entry type definition files, you'll often see the content is wrapped in a `Dynamic` and a `Static` module. What does that mean?

- **Static** values come from the YAML files, so they have been defined there and they will not change while the program runs.
- **Dynamic** values are kind of like *instances* of the *static* values. They are part of the heroes and define how an entry is configured for that hero.

For example, a `Spell.Static.t` type is the static representation of a spell: It contains it's name, IC, duration, target category, and so on. The `Spell.Dynamic.t` type is the dynamic representation of the spell for a specific hero: Is the spell active? If yes, which SR does it have?
