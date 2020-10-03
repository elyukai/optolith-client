let getSingle =
    (
      ~target,
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
    )
    : SelectOption.t => {
  id: (Generic, id),
  name: targetName ++ ": " ++ name,
  apValue: Some(cost),
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
};

let getAllFromObject =
    (
      ~target,
      ~targetId,
      ~targetName,
      ~targetIC,
      {levels: (level1, level2, level3), src, errata}: Enhancements.t,
    ) => [
  getSingle(
    ~target,
    ~targetId,
    ~targetName,
    ~level=1,
    ~id=level1.id,
    ~name=level1.name,
    ~cost=IC.getAPForActivatation(targetIC),
    ~description=level1.effect,
    ~prerequisites=Plain([]),
    ~src,
    ~errata,
  ),
  getSingle(
    ~target,
    ~targetId,
    ~targetName,
    ~level=2,
    ~id=level2.id,
    ~name=level2.name,
    ~cost=IC.getAPForActivatation(targetIC) * 2,
    ~description=level2.effect,
    ~prerequisites=
      Plain(
        level2.requiresLevel1
          ? [
            {
              value:
                Activatable({
                  id: (
                    SpecialAbility,
                    Id.SpecialAbility.toInt(SpellEnhancement),
                  ),
                  active: true,
                  options: [(Generic, level1.id)],
                  level: None,
                }),
              displayOption: Generate,
            },
          ]
          : [],
      ),
    ~src,
    ~errata,
  ),
  getSingle(
    ~target,
    ~targetId,
    ~targetName,
    ~level=3,
    ~id=level3.id,
    ~name=level3.name,
    ~cost=IC.getAPForActivatation(targetIC) * 3,
    ~description=level3.effect,
    ~prerequisites=
      switch (level3.requiresPrevious) {
      | Some(First) =>
        Plain([
          {
            value:
              Activatable({
                id: (
                  SpecialAbility,
                  Id.SpecialAbility.toInt(SpellEnhancement),
                ),
                active: true,
                options: [(Generic, level1.id)],
                level: None,
              }),
            displayOption: Generate,
          },
        ])
      | Some(Second) =>
        Plain([
          {
            value:
              Activatable({
                id: (
                  SpecialAbility,
                  Id.SpecialAbility.toInt(SpellEnhancement),
                ),
                active: true,
                options: [(Generic, level2.id)],
                level: None,
              }),
            displayOption: Generate,
          },
        ])
      | None => Plain([])
      },
    ~src,
    ~errata,
  ),
];

let toSpecialAbilityOptions =
    (getTarget, getId, getName, getEnhancements, getIC, xs) =>
  Ley_List.foldr(
    x =>
      x
      |> getEnhancements
      |> Ley_Option.option(Ley_Function.id, enhancements =>
           getAllFromObject(
             ~target=getTarget(x),
             ~targetId=getId(x),
             ~targetName=getName(x),
             ~targetIC=getIC(x),
             enhancements,
           )
           |> Ley_Function.flip(
                Ley_List.foldr((selectOption: SelectOption.t) =>
                  SelectOption.Map.insert(selectOption.id, selectOption)
                ),
              )
         ),
    SelectOption.Map.empty,
    xs,
  );

let spellsToSpecialAbilityOptions =
  toSpecialAbilityOptions(
    (x: Spell.Static.t) => Spell(x),
    x => x.id,
    x => x.name,
    x => x.enhancements,
    x => x.ic,
  );

let liturgicalChantsToSpecialAbilityOptions =
  toSpecialAbilityOptions(
    (x: LiturgicalChant.Static.t) => LiturgicalChant(x),
    x => x.id,
    x => x.name,
    x => x.enhancements,
    x => x.ic,
  );
