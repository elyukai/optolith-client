open RawEntries;

module Integrity = {
  module Entity = {
    open IntMap;

    let toMapIntegrity = xs =>
      List.fold_right(
        ((k, v), mp) =>
          member(k, mp)
            ? raise(
                Json.Decode.DecodeError(
                  "toMapIntegrity: Key "
                  ++ Js.Int.toString(k)
                  ++ "is set twice",
                ),
              )
            : insert(k, v, mp),
        xs,
        empty,
      );
  };
};

module Zip = {
  let rec zipBy =
          (
            getKeyFromOptional,
            getKeyFromRequired,
            merge,
            optionals,
            requireds,
          ) =>
    switch (requireds) {
    | [] => []
    | [r, ...rs] =>
      switch (
        List.find_opt(
          o => o |> getKeyFromOptional |> (k => k == getKeyFromRequired(r)),
          optionals,
        )
      ) {
      | Some(o) => [
          merge(r, o),
          ...zipBy(
               getKeyFromOptional,
               getKeyFromRequired,
               merge,
               optionals,
               rs,
             ),
        ]
      | None =>
        raise(
          Json.Decode.DecodeError(
            "zipBy: No matching entry found at key "
            ++ Js.Int.toString(getKeyFromRequired(r)),
          ),
        )
      }
    };
};

module Aspects = {
  open Integrity.Entity;

  let fromJson = yaml => AspectsL10n.fromJson(yaml) |> toMapIntegrity;
};

module ExperienceLevels = {
  open Integrity.Entity;

  let%private merge =
              (l10n: ExperienceLevelsL10n.t, univ: ExperienceLevelsUniv.t)
              : (int, Static.ExperienceLevel.t) => (
    univ.id,
    {
      id: univ.id,
      name: l10n.name,
      ap: univ.ap,
      maxAttributeValue: univ.maxAttributeValue,
      maxSkillRating: univ.maxSkillRating,
      maxCombatTechniqueRating: univ.maxCombatTechniqueRating,
      maxTotalAttributeValues: univ.maxTotalAttributeValues,
      maxSpellsLiturgicalChants: univ.maxSpellsLiturgicalChants,
      maxUnfamiliarSpells: univ.maxUnfamiliarSpells,
    },
  );

  let fromJson = yaml =>
    Zip.zipBy(
      (x: ExperienceLevelsUniv.t) => x.id,
      (x: ExperienceLevelsL10n.t) => x.id,
      merge,
      ExperienceLevelsUniv.fromJson(yaml),
      ExperienceLevelsL10n.fromJson(yaml),
    )
    |> toMapIntegrity;
};
