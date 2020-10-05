type staticEntry =
  | Blessing(Blessing.Static.t)
  | Cantrip(Cantrip.Static.t)
  | CombatTechnique(CombatTechnique.Static.t)
  | LiturgicalChant(LiturgicalChant.Static.t)
  | Skill(Skill.Static.t)
  | Spell(Spell.Static.t);

type t = {
  id: Id.Activatable.SelectOption.t,
  name: string,
  apValue: option(int),
  prerequisites: Prerequisite.Collection.General.t,
  description: option(string),
  isSecret: option(bool),
  languages: option(list(int)),
  continent: option(int),
  isExtinct: option(bool),
  specializations: option(list(string)),
  specializationInput: option(string),
  animalGr: option(int),
  animalLevel: option(int),
  enhancementTarget: option(int),
  enhancementLevel: option(int),
  staticEntry: option(staticEntry),
  // needed to be able to filter valid applications without altering the static
  // entry
  applications: option(list(Skill.Static.Application.t)),
  src: list(PublicationRef.t),
  errata: list(Erratum.t),
};

let showId: Id.Activatable.SelectOption.t => string;

module Map: Ley_Map.T with type key = Id.Activatable.SelectOption.t;

type map = Map.t(t);

type multilingual;

let decodeMultilingualPair:
  Js.Json.t => (Id.Activatable.SelectOption.t, multilingual);

let resolveTranslations: (Locale.order, multilingual) => option(t);

module Category: {
  type t =
    | Blessings
    | Cantrips
    | CombatTechniques
    | LiturgicalChants
    | Skills
    | Spells;

  module WithGroups: {
    type nonrec t = {
      category: t,
      groups: option(list(int)),
    };

    let decode: Json.Decode.decoder(t);
  };
};

module ResolveCategories: {
  /**
   * Takes an array of select option categories and resolves them into a list of
   * select options.
   */
  let resolveCategories:
    (
      Ley_IntMap.t(Blessing.Static.t),
      Ley_IntMap.t(Cantrip.Static.t),
      Ley_IntMap.t(CombatTechnique.Static.t),
      Ley_IntMap.t(LiturgicalChant.Static.t),
      Ley_IntMap.t(Skill.Static.t),
      Ley_IntMap.t(Spell.Static.t),
      Ley_Option.t(Ley_List.t(Category.WithGroups.t))
    ) =>
    Map.t(t);

  let mergeSelectOptions: (Map.t(t), Map.t(t)) => Map.t(t);
};
