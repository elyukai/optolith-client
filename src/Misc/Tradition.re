open Static;
module L = Ley_List;
module IM = Ley_IntMap;
module O = Ley_Option;

module Magical = {
  let isTraditionId = (staticData, id) =>
    IM.member(id, staticData.magicalTraditions);

  let isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable_Accessors.isActive(x);

  let getHeroEntries = (staticData, mp: IM.t(Hero.Activatable.t)) =>
    mp |> IM.elems |> L.filter(isActiveTradition(staticData));

  let getStaticEntries = (staticData, mp: IM.t(Hero.Activatable.t)) =>
    mp
    |> IM.elems
    |> O.mapOption(trad =>
         isActiveTradition(staticData, trad)
           ? IM.lookup(trad.id, staticData.specialAbilities) : None
       );

  type fullTradition = (
    SpecialAbility.t,
    Hero.Activatable.t,
    MagicalTradition.t,
  );

  let getEntries =
      (staticData, mp: IM.t(Hero.Activatable.t)): list(fullTradition) =>
    mp
    |> IM.elems
    |> O.mapOption(trad =>
         isActiveTradition(staticData, trad)
           ? O.Monad.liftM2(
               (staticEntry, traditionEntry) =>
                 (staticEntry, trad, traditionEntry),
               IM.lookup(trad.id, staticData.specialAbilities),
               IM.lookup(trad.id, staticData.magicalTraditions),
             )
           : None
       );

  let idToNumId = (staticData, id) =>
    O.Monad.(IM.lookup(id, staticData.magicalTraditions) >>= (x => x.numId));

  let numIdToId = (staticData, id) =>
    O.Functor.(
      IM.Foldable.find(
        (trad: MagicalTradition.t) => trad.numId === id,
        staticData.magicalTraditions,
      )
      <&> (x => x.id)
    );

  let getPrimaryAttributeId = (staticData, mp: IM.t(Hero.Activatable.t)) =>
    O.Monad.(
      mp
      |> IM.elems
      |> L.Extra.firstJust(trad =>
           isActiveTradition(staticData, trad)
             ? IM.lookup(trad.id, staticData.magicalTraditions) : None
         )
      >>= (trad => trad.primary)
    );
};

module Blessed = {
  let isTraditionId = (staticData, id) =>
    IM.member(id, staticData.blessedTraditions);

  let isActiveTradition = (staticData, x: Hero.Activatable.t) =>
    isTraditionId(staticData, x.id) && Activatable_Accessors.isActive(x);

  let getHeroEntry = (staticData, mp: IM.t(Hero.Activatable.t)) =>
    IM.Foldable.find(isActiveTradition(staticData), mp);

  let getStaticEntry = (staticData, mp: IM.t(Hero.Activatable.t)) =>
    O.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (trad => IM.lookup(trad.id, staticData.specialAbilities))
    );

  type fullTradition = (
    SpecialAbility.t,
    Hero.Activatable.t,
    BlessedTradition.t,
  );

  let getEntry =
      (staticData, mp: IM.t(Hero.Activatable.t)): option(fullTradition) =>
    O.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (
        trad =>
          liftM2(
            (staticEntry, traditionEntry) =>
              (staticEntry, trad, traditionEntry),
            IM.lookup(trad.id, staticData.specialAbilities),
            IM.lookup(trad.id, staticData.blessedTraditions),
          )
      )
    );

  let idToNumId = (staticData, id) =>
    O.Functor.(
      IM.lookup(id, staticData.blessedTraditions) <&> (x => x.numId)
    );

  let numIdToId = (staticData, id) =>
    O.Functor.(
      IM.Foldable.find(
        (trad: BlessedTradition.t) => trad.numId === id,
        staticData.blessedTraditions,
      )
      <&> (x => x.id)
    );

  let getPrimaryAttributeId = (staticData, mp: IM.t(Hero.Activatable.t)) =>
    O.Monad.(
      mp
      |> getHeroEntry(staticData)
      >>= (trad => IM.lookup(trad.id, staticData.magicalTraditions))
      >>= (trad => trad.primary)
    );
};
