module IM = Ley_IntMap;
module O = Ley_Option;

module Decode = {
  let%private getSingle =
              (
                ~target: LiturgicalChant.t,
                ~level,
                ~id,
                ~name,
                ~cost,
                ~description,
                ~prerequisites,
                ~src,
                ~errata,
              ) => (
    id,
    {
      id: `Generic(id),
      name: target.name ++ ": " ++ name,
      cost: Some(cost),
      prerequisites,
      description: Some(description),
      isSecret: None,
      languages: None,
      continent: None,
      isExtinct: None,
      specializations: None,
      specializationInput: None,
      animalGr: None,
      animalLevel: None,
      enhancementTarget: Some(target.id),
      enhancementLevel: Some(level),
      wikiEntry: Some(LiturgicalChant(target)),
      applications: None,
      src,
      errata,
    }: SelectOption.t,
  );

  let%private getAllFromObject = (target, x: LiturgicalChant.enhancement) => [
    getSingle(
      ~target,
      ~level=1,
      ~id=x.level1.id,
      ~name=x.level1.name,
      ~cost=x.level1.cost,
      ~description=x.level1.effect,
      ~prerequisites=Prerequisite.empty,
      ~src=x.src,
      ~errata=x.errata,
    ),
    getSingle(
      ~target,
      ~level=2,
      ~id=x.level2.id,
      ~name=x.level2.name,
      ~cost=x.level2.cost,
      ~description=x.level2.effect,
      ~prerequisites={
        ...Prerequisite.empty,
        activatable:
          x.level2.requireLevel1
            ? [
              {
                id: `SpecialAbility(Id.specialAbilityToInt(SpellEnhancement)),
                active: true,
                sid: Some(`Generic(x.level1.id)),
                sid2: None,
                level: None,
              },
            ]
            : [],
      },
      ~src=x.src,
      ~errata=x.errata,
    ),
    getSingle(
      ~target,
      ~level=3,
      ~id=x.level3.id,
      ~name=x.level3.name,
      ~cost=x.level3.cost,
      ~description=x.level3.effect,
      ~prerequisites={
        ...Prerequisite.empty,
        activatable:
          switch (x.level3.requirePrevious) {
          | Some(First) => [
              {
                id: `SpecialAbility(Id.specialAbilityToInt(SpellEnhancement)),
                active: true,
                sid: Some(`Generic(x.level1.id)),
                sid2: None,
                level: None,
              },
            ]
          | Some(Second) => [
              {
                id: `SpecialAbility(Id.specialAbilityToInt(SpellEnhancement)),
                active: true,
                sid: Some(`Generic(x.level2.id)),
                sid2: None,
                level: None,
              },
            ]
          | None => []
          },
      },
      ~src=x.src,
      ~errata=x.errata,
    ),
  ];

  let liturgicalChantEnhancements = (liturgicalChants, xs) =>
    Ley_List.Monad.(
      xs
      >>= (
        (enhancement: LiturgicalChant.enhancement) =>
          IM.lookup(enhancement.target, liturgicalChants)
          |> O.option([], liturgicalChant =>
               getAllFromObject(liturgicalChant, enhancement)
             )
      )
      |> Ley_IntMap.fromList
    );
};
