open Static;
open Ley.IntMap;
open Ley.Option;

module Magical = {
  let isTraditionId = (staticData, id) =>
    member(id, staticData.magicalTraditions);

  let isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable.isActive(x);

  let getHeroEntries = (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    mp |> Ley.IntMap.elems |> Ley.List.filter(isActiveTradition(staticData));

  let getStaticEntries = (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    mp
    |> elems
    |> mapOption(trad =>
         isActiveTradition(staticData, trad)
           ? Ley.IntMap.lookup(trad.id, staticData.specialAbilities) : None
       );

  type fullTradition = (
    Static.SpecialAbility.t,
    Hero.Activatable.t,
    Static.MagicalTradition.t,
  );

  let getEntries =
      (staticData, mp: Ley.IntMap.t(Hero.Activatable.t))
      : list(fullTradition) =>
    mp
    |> elems
    |> mapOption(trad =>
         isActiveTradition(staticData, trad)
           ? Ley.Option.Monad.liftM2(
               (staticEntry, traditionEntry) =>
                 (staticEntry, trad, traditionEntry),
               Ley.IntMap.lookup(trad.id, staticData.specialAbilities),
               Ley.IntMap.lookup(trad.id, staticData.magicalTraditions),
             )
           : None
       );

  let idToNumId = (staticData, id) =>
    Ley.Option.Monad.(
      Ley.IntMap.lookup(id, staticData.magicalTraditions) >>= (x => x.numId)
    );

  let numIdToId = (staticData, id) =>
    Ley.Option.Functor.(
      Ley.IntMap.Foldable.find(
        (trad: MagicalTradition.t) => trad.numId === id,
        staticData.magicalTraditions,
      )
      <&> (x => x.id)
    );

  let getPrimaryAttributeId =
      (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    Ley.Option.Monad.(
      mp
      |> elems
      |> Ley.List.Extra.firstJust(trad =>
           isActiveTradition(staticData, trad)
             ? Ley.IntMap.lookup(trad.id, staticData.magicalTraditions) : None
         )
      >>= (trad => trad.primary)
    );
};

module Blessed = {
  let isTraditionId = (staticData, id) =>
    Ley.IntMap.member(id, staticData.blessedTraditions);

  let isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable.isActive(x);

  let getHeroEntry = (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    Ley.IntMap.Foldable.find(isActiveTradition(staticData), mp);

  let getStaticEntry = (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    Ley.Option.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (trad => Ley.IntMap.lookup(trad.id, staticData.specialAbilities))
    );

  type fullTradition = (
    Static.SpecialAbility.t,
    Hero.Activatable.t,
    Static.BlessedTradition.t,
  );

  let getEntry =
      (staticData, mp: Ley.IntMap.t(Hero.Activatable.t))
      : option(fullTradition) =>
    Ley.Option.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (
        trad =>
          liftM2(
            (staticEntry, traditionEntry) =>
              (staticEntry, trad, traditionEntry),
            Ley.IntMap.lookup(trad.id, staticData.specialAbilities),
            Ley.IntMap.lookup(trad.id, staticData.blessedTraditions),
          )
      )
    );

  let idToNumId = (staticData, id) =>
    Ley.Option.Functor.(
      Ley.IntMap.lookup(id, staticData.blessedTraditions) <&> (x => x.numId)
    );

  let numIdToId = (staticData, id) =>
    Ley.Option.Functor.(
      Ley.IntMap.Foldable.find(
        (trad: BlessedTradition.t) => trad.numId === id,
        staticData.blessedTraditions,
      )
      <&> (x => x.id)
    );

  let getPrimaryAttributeId =
      (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    Ley.Option.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (trad => Ley.IntMap.lookup(trad.id, staticData.magicalTraditions))
      >>= (trad => trad.primary)
    );
};
