let rec zipBy =
        (
          showKey,
          merge,
          getKeyFromOptional,
          getKeyFromRequired,
          optionals: list('a),
          requireds: list('b),
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
        merge(o, r),
        ...zipBy(
             showKey,
             merge,
             getKeyFromOptional,
             getKeyFromRequired,
             optionals,
             rs,
           ),
      ]
    | None =>
      raise(
        Json.Decode.DecodeError(
          "zipBy: No matching entry found at key "
          ++ showKey(getKeyFromRequired(r)),
        ),
      )
    }
  };

let rec zipByPartition =
        (
          showKey,
          mapBoth,
          mapSingle,
          getKeyFromOptional,
          getKeyFromRequired,
          optionals: list('a),
          requireds: list('b),
        ) =>
  switch (requireds) {
  | [] => ([], [])
  | [r, ...rs] =>
    switch (
      List.find_opt(
        o => o |> getKeyFromOptional |> (k => k == getKeyFromRequired(r)),
        optionals,
      )
    ) {
    | Some(o) =>
      zipByPartition(
        showKey,
        mapBoth,
        mapSingle,
        getKeyFromOptional,
        getKeyFromRequired,
        optionals,
        rs,
      )
      |> (((mergeds, singles)) => ([mapBoth(o, r), ...mergeds], singles))
    | None =>
      zipByPartition(
        showKey,
        mapBoth,
        mapSingle,
        getKeyFromOptional,
        getKeyFromRequired,
        optionals,
        rs,
      )
      |> (((mergeds, singles)) => (mergeds, [mapSingle(r), ...singles]))
    }
  };

/*
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
 */
