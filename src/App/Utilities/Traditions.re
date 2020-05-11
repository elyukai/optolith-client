open Static;
open Ley.IntMap;
open Ley.Option;

module Magical = {
  let%private isTraditionId = (staticData, id) =>
    member(id, staticData.magicalTraditions);

  let%private isActiveTradition = (staticData, x: Hero.Activatable.t) =>
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

  let getEntries = (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
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
    Ley.Option.Functor.(
      Ley.IntMap.lookup(id, staticData.magicalTraditions) <&> (x => x.numId)
    );

  let numIdToId = (staticData, id) =>
    Ley.Option.Functor.(
      Ley.IntMap.Foldable.find(
        (trad: MagicalTradition.t) => trad.numId === id,
        staticData.magicalTraditions,
      )
      <&> (x => x.id)
    );
};

module Blessed = {
  let%private isTraditionId = (staticData, id) =>
    Ley.IntMap.member(id, staticData.blessedTraditions);

  let%private isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable.isActive(x);

  let getHeroEntry = (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    Ley.IntMap.Foldable.find(isActiveTradition(staticData), mp);

  let getStaticEntry = (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    Ley.Option.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (trad => Ley.IntMap.lookup(trad.id, staticData.specialAbilities))
    );

  let getEntry = (staticData, mp: Ley.IntMap.t(Hero.Activatable.t)) =>
    Ley.Option.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (
        trad =>
          liftM2(
            (staticEntry, traditionEntry) =>
              (staticEntry, trad, traditionEntry),
            Ley.IntMap.lookup(trad.id, staticData.specialAbilities),
            Ley.IntMap.lookup(trad.id, staticData.magicalTraditions),
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
};
