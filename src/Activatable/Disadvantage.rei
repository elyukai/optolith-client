module Static: {
  type t = {
    id: int,
    name: string,
    nameInWiki: option(string),
    noMaxAPInfluence: bool,
    isExclusiveToArcaneSpellworks: bool,
    levels: option(int),
    max: option(int),
    rules: string,
    selectOptions: SelectOption.map,
    input: option(string),
    range: option(string),
    prerequisites: Prerequisite.Collection.AdvantageDisadvantage.t,
    prerequisitesText: option(string),
    prerequisitesTextStart: option(string),
    prerequisitesTextEnd: option(string),
    apValue: option(Advantage.Static.apValue),
    apValueText: option(string),
    apValueTextAppend: option(string),
    gr: int,
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
  };
};
