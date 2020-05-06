open Static;

module Magical = {
  let%private isTraditionId = (staticData, id) =>
    IntMap.member(id, staticData.magicalTraditions);

  let%private isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable.isActive(x);

  let getHeroEntries = (staticData, mp: IntMap.t(Hero.Activatable.t)) =>
    mp |> IntMap.elems |> ListH.filter(isActiveTradition(staticData));

  let getStaticEntries = (staticData, mp: IntMap.t(Hero.Activatable.t)) =>
    mp
    |> IntMap.elems
    |> Maybe.mapMaybe(trad =>
         isActiveTradition(staticData, trad)
           ? IntMap.lookup(trad.id, staticData.specialAbilities) : Nothing
       );

  let getEntries = (staticData, mp: IntMap.t(Hero.Activatable.t)) =>
    mp
    |> IntMap.elems
    |> Maybe.mapMaybe(trad =>
         isActiveTradition(staticData, trad)
           ? Maybe.Monad.liftM2(
               (staticEntry, traditionEntry) =>
                 (staticEntry, trad, traditionEntry),
               IntMap.lookup(trad.id, staticData.specialAbilities),
               IntMap.lookup(trad.id, staticData.magicalTraditions),
             )
           : Nothing
       );

  let idToNumId = (staticData, id) =>
    Maybe.Functor.(
      IntMap.lookup(id, staticData.magicalTraditions) <&> (x => x.numId)
    );

  let numIdToId = (staticData, id) =>
    Maybe.Functor.(
      IntMap.Foldable.find(
        (trad: MagicalTradition.t) => trad.numId === id,
        staticData.magicalTraditions,
      )
      <&> (x => x.id)
    );
};

module Blessed = {
  let%private isTraditionId = (staticData, id) =>
    IntMap.member(id, staticData.blessedTraditions);

  let%private isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable.isActive(x);

  let getHeroEntry = (staticData, mp: IntMap.t(Hero.Activatable.t)) =>
    IntMap.Foldable.find(isActiveTradition(staticData), mp);

  let getStaticEntry = (staticData, mp: IntMap.t(Hero.Activatable.t)) =>
    Maybe.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (trad => IntMap.lookup(trad.id, staticData.specialAbilities))
    );

  let getEntry = (staticData, mp: IntMap.t(Hero.Activatable.t)) =>
    Maybe.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (
        trad =>
          Maybe.Monad.liftM2(
            (staticEntry, traditionEntry) =>
              (staticEntry, trad, traditionEntry),
            IntMap.lookup(trad.id, staticData.specialAbilities),
            IntMap.lookup(trad.id, staticData.magicalTraditions),
          )
      )
    );

  let idToNumId = (staticData, id) =>
    Maybe.Functor.(
      IntMap.lookup(id, staticData.blessedTraditions) <&> (x => x.numId)
    );

  let numIdToId = (staticData, id) =>
    Maybe.Functor.(
      IntMap.Foldable.find(
        (trad: BlessedTradition.t) => trad.numId === id,
        staticData.blessedTraditions,
      )
      <&> (x => x.id)
    );
};
