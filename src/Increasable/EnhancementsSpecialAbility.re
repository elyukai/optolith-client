let getSingle =
    (
      ~targetId,
      ~targetName,
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
    id: (Generic, id),
    name: targetName ++ ": " ++ name,
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
    enhancementTarget: Some(targetId),
    enhancementLevel: Some(level),
    wikiEntry: Some(target),
    applications: None,
    src,
    errata,
  }: SelectOption.t,
);

let getAllFromObject = (~target, ~targetId, ~targetName, x: Enhancements.t) => [
  getSingle(
    ~target,
    ~targetId,
    ~targetName,
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
    ~targetId,
    ~targetName,
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
              id: (SpecialAbility, Id.SpecialAbility.toInt(SpellEnhancement)),
              active: true,
              sid: Some((Generic, x.level1.id)),
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
    ~targetId,
    ~targetName,
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
              id: (SpecialAbility, Id.SpecialAbility.toInt(SpellEnhancement)),
              active: true,
              sid: Some((Generic, x.level1.id)),
              sid2: None,
              level: None,
            },
          ]
        | Some(Second) => [
            {
              id: (SpecialAbility, Id.SpecialAbility.toInt(SpellEnhancement)),
              active: true,
              sid: Some((Generic, x.level2.id)),
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

let toSpecialAbilityOptions = (getId, getName, getEnhancements, xs) =>
  Ley_List.Foldable.foldr(
    x =>
      x
      |> getEnhancements
      |> O.option(id, enhancements =>
           getAllFromObject(
             ~target: x,
             ~targetId: getId(x),
             ~targetName: getName(x),
             enhancements,
           )
           |> Ley_Function.flip(
                Ley_List.Foldable.foldr(selectOption =>
                  SelectOption.Map.insert(
                    Generic(selectOption.id),
                    selectOption,
                  )
                ),
              )
         ),
    SelectOption.Map.empty,
    xs,
  );

let spellsToSpecialAbilityOptions =
  toSpecialAbilityOptions(
    (x: Spell.Static.t) => x.id,
    x => x.name,
    x => x.enhancements,
  );

let liturgicalChantsToSpecialAbilityOptions =
  toSpecialAbilityOptions(
    (x: LiturgicalChant.Static.t) => x.id,
    x => x.name,
    x => x.enhancements,
  );
