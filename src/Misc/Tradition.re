open Static;
open Ley_IntMap;
open Ley_Option;

module Magical = {
  let isTraditionId = (staticData, id) =>
    member(id, staticData.magicalTraditions);

  let isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable_Accessors.isActive(x);

  let getHeroEntries = (staticData, mp: Ley_IntMap.t(Hero.Activatable.t)) =>
    mp |> Ley_IntMap.elems |> Ley_List.filter(isActiveTradition(staticData));

  let getStaticEntries = (staticData, mp: Ley_IntMap.t(Hero.Activatable.t)) =>
    mp
    |> elems
    |> mapOption(trad =>
         isActiveTradition(staticData, trad)
           ? Ley_IntMap.lookup(trad.id, staticData.specialAbilities) : None
       );

  type fullTradition = (
    SpecialAbility.t,
    Hero.Activatable.t,
    MagicalTradition.t,
  );

  let getEntries =
      (staticData, mp: Ley_IntMap.t(Hero.Activatable.t))
      : list(fullTradition) =>
    mp
    |> elems
    |> mapOption(trad =>
         isActiveTradition(staticData, trad)
           ? Ley_Option.Monad.liftM2(
               (staticEntry, traditionEntry) =>
                 (staticEntry, trad, traditionEntry),
               Ley_IntMap.lookup(trad.id, staticData.specialAbilities),
               Ley_IntMap.lookup(trad.id, staticData.magicalTraditions),
             )
           : None
       );

  let idToNumId = (staticData, id) =>
    Ley_Option.Monad.(
      Ley_IntMap.lookup(id, staticData.magicalTraditions) >>= (x => x.numId)
    );

  let numIdToId = (staticData, id) =>
    Ley_Option.Functor.(
      Ley_IntMap.Foldable.find(
        (trad: MagicalTradition.t) => trad.numId === id,
        staticData.magicalTraditions,
      )
      <&> (x => x.id)
    );

  let getPrimaryAttributeId =
      (staticData, mp: Ley_IntMap.t(Hero.Activatable.t)) =>
    Ley_Option.Monad.(
      mp
      |> elems
      |> Ley_List.Extra.firstJust(trad =>
           isActiveTradition(staticData, trad)
             ? Ley_IntMap.lookup(trad.id, staticData.magicalTraditions) : None
         )
      >>= (trad => trad.primary)
    );
};

module Blessed = {
  let isTraditionId = (staticData, id) =>
    Ley_IntMap.member(id, staticData.blessedTraditions);

  let isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable_Accessors.isActive(x);

  let getHeroEntry = (staticData, mp: Ley_IntMap.t(Hero.Activatable.t)) =>
    Ley_IntMap.Foldable.find(isActiveTradition(staticData), mp);

  let getStaticEntry = (staticData, mp: Ley_IntMap.t(Hero.Activatable.t)) =>
    Ley_Option.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (trad => Ley_IntMap.lookup(trad.id, staticData.specialAbilities))
    );

  type fullTradition = (
    SpecialAbility.t,
    Hero.Activatable.t,
    BlessedTradition.t,
  );

  let getEntry =
      (staticData, mp: Ley_IntMap.t(Hero.Activatable.t))
      : option(fullTradition) =>
    Ley_Option.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (
        trad =>
          liftM2(
            (staticEntry, traditionEntry) =>
              (staticEntry, trad, traditionEntry),
            Ley_IntMap.lookup(trad.id, staticData.specialAbilities),
            Ley_IntMap.lookup(trad.id, staticData.blessedTraditions),
          )
      )
    );

  let idToNumId = (staticData, id) =>
    Ley_Option.Functor.(
      Ley_IntMap.lookup(id, staticData.blessedTraditions) <&> (x => x.numId)
    );

  let numIdToId = (staticData, id) =>
    Ley_Option.Functor.(
      Ley_IntMap.Foldable.find(
        (trad: BlessedTradition.t) => trad.numId === id,
        staticData.blessedTraditions,
      )
      <&> (x => x.id)
    );

  let getPrimaryAttributeId =
      (staticData, mp: Ley_IntMap.t(Hero.Activatable.t)) =>
    Ley_Option.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (trad => Ley_IntMap.lookup(trad.id, staticData.magicalTraditions))
      >>= (trad => trad.primary)
    );
};
