/**
 * `getAvailableSelectOptions static hero magicalTraditions staticEntry
 * heroEntry` returns a list of possible select options for an inactive
 * activatable entry. Note: If `None` is returned, no select option is valid and
 * thus the entry cannot be added at all. This is different to a returned empty
 * list, which can happen if the entry just has no select options at all.
 */
let getAvailableSelectOptions:
  (
    Static.t,
    Hero.t,
    list(Tradition.Magical.fullTradition),
    Static.activatable,
    option(Activatable_Dynamic.t)
  ) =>
  option(list(SelectOption.t));
