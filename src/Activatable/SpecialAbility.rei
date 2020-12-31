module Static: {
  module ApplicableCombatTechniques: {
    type generalRestriction =
      | Improvised
      | PointedBlade
      | Mount
      | Race(int) // Only from a certain race
      | ExcludeTechniques(list(int));

    type meleeRestriction =
      | Improvised
      | PointedBlade
      | Mount
      | HasParry
      | OneHanded
      | Race(int) // Only from a certain race
      | ExcludeTechniques(list(int));

    type specificRestriction =
      | Improvised
      | PointedBlade
      | Mount
      | Race(int) // Only from a certain race
      | Level(int) // Only from a certain level of the special ability
      | Weapons(list(int)); // Only certain weapons

    type specific = {
      id: int,
      restrictions: list(specificRestriction),
    };

    type t =
      | All(list(generalRestriction))
      | AllMelee(list(meleeRestriction))
      | AllRanged(list(generalRestriction))
      | Specific(list(specific))
      | DependingOnCombatStyle;
  };

  module Extended: {
    type entry = {
      id: int,
      option: option(OneOrMany.t(int)),
    };

    type t = (entry, entry, entry);
  };

  module Property: {
    type t =
      | DependingOnProperty
      | Single(int);
  };

  type groupSpecific =
    | Default
        // 1, 2, 4, 6, 7, 14, 24, 26, 27, 28, 29, 31, 32, 34, 40, 41
        ({rules: string})
    | Combat({
        // 3, 11, 12, 21
        rules: string,
        type_: int,
        combatTechniques: ApplicableCombatTechniques.t,
        penalty: option(string),
      })
    | ProtectiveWardingCircle({
        // 8
        aeCost: int,
        protectiveCircle: string,
        wardingCircle: string,
      })
    | CombatStyle({
        // 9, 10
        rules: string,
        type_: int,
        combatTechniques: ApplicableCombatTechniques.t,
        penalty: option(string),
        extended: Extended.t,
      })
    | GeneralStyle({
        // 13, 25, 33
        rules: string,
        extended: Extended.t,
      })
    | TraditionArtifact({
        // 5, 15, 16, 17, 18, 19, 35, 37, 38, 39, 42, 43, 44, 45
        effect: string,
        aeCost: option(string),
        volume: string,
        bindingCost: option(string),
        property: Property.t,
      })
    | Steckenzauber({
        // 20
        effect: string,
        aeCost: string,
        property: Property.t,
      })
    | AncestorGlyphs({
        // 22
        rules: string,
        aeCost: string,
      })
    | CeremonialItem({
        // 23
        effect: string,
        aspect: int,
      })
    | Paktgeschenk
        // 30
        ({effect: string})
    | Kesselzauber({
        // 36
        effect: string,
        aeCost: option(string),
        volume: option(string),
        bindingCost: option(string),
        brew: int,
        property: Property.t,
      });

  type t = {
    id: int,
    name: string,
    nameInWiki: option(string),
    levels: option(int),
    max: option(int),
    selectOptions: SelectOption.map,
    input: option(string),
    gr: int,
    groupSpecific,
    prerequisites: Prerequisite.Collection.General.t,
    prerequisitesText: option(string),
    prerequisitesTextStart: option(string),
    prerequisitesTextEnd: option(string),
    apValue: option(Advantage.Static.apValue),
    apValueText: option(string),
    apValueTextAppend: option(string),
    src: list(PublicationRef.t),
    errata: list(Erratum.t),
  };

  module Decode: {
    let assoc:
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
        ~spellEnhancements: SelectOption.map,
        ~liturgicalChantEnhancements: SelectOption.map
      ) =>
      Json_Decode_Static.decodeAssoc(t);

    /**
   * `modifyParsed` specifically modifies some parsed special abilities which
   * can't be applied by generic behavior and should be applied after the full
   * decoding.
   */
    let modifyParsed: Ley_IntMap.t(t) => Ley_IntMap.t(t);
  };
};
