type staticEntry =
  | Blessing(Blessing.Static.t)
  | Cantrip(Cantrip.Static.t)
  | CombatTechnique(CombatTechnique.Static.t)
  | LiturgicalChant(LiturgicalChant.Static.t)
  | Skill(Skill.Static.t)
  | Spell(Spell.Static.t)
  | TradeSecret(TradeSecret.t)
  | Language(Language.t)
  | Script(Script.t)
  | AnimalShape(AnimalShape.t);

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

module Decode: {
  type multilingual;

  let multilingualAssoc:
    Json.Decode.decoder((Id.Activatable.SelectOption.t, multilingual));

  let resolveTranslations: (Locale.order, multilingual) => option(t);

  module Category: {
    type t =
      | Blessings
      | Cantrips
      | CombatTechniques(list(int))
      | LiturgicalChants(list(int))
      | Skills(list(int))
      | Spells(list(int))
      | TradeSecrets
      | Languages
      | Scripts
      | AnimalShapes
      | SpellEnhancements
      | LiturgicalChantEnhancements;

    let t: Json.Decode.decoder(t);
  };

  module ResolveCategories: {
    /**
     * Takes an array of select option categories and resolves them into a list of
     * select options.
     */
    let resolveCategories:
      (
        ~blessings: Ley_IntMap.t(Blessing.Static.t),
        ~cantrips: Ley_IntMap.t(Cantrip.Static.t),
        ~combatTechniques: Ley_IntMap.t(CombatTechnique.Static.t),
        ~liturgicalChants: Ley_IntMap.t(LiturgicalChant.Static.t),
        ~skills: Ley_IntMap.t(Skill.Static.t),
        ~spells: Ley_IntMap.t(Spell.Static.t),
        ~tradeSecrets: Ley_IntMap.t(TradeSecret.t),
        ~languages: Ley_IntMap.t(Language.t),
        ~scripts: Ley_IntMap.t(Script.t),
        ~animalShapes: Ley_IntMap.t(AnimalShape.t),
        ~spellEnhancements: map,
        ~liturgicalChantEnhancements: map,
        ~src: list(PublicationRef.t),
        ~errata: list(Erratum.t),
        Ley_Option.t(Ley_List.t(Category.t))
      ) =>
      map;

    let mergeSelectOptions: (map, map) => map;
  };
};
