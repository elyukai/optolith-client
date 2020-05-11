open Ley.Option;

/**
 * `flattenDependencies(getValueForTargetId, id, dependencies)` flattens the
 * list of dependencies to usable values. That means, optional dependencies
 * (objects) will be evaluated and will be included in the resulting list,
 * depending on whether it has to follow the optional dependency or not. The
 * result is a plain `List` of all non-optional dependencies.
 */
let flattenSkill = (getValueForTargetId, id, dependencies) =>
  mapOption(
    (dep: Hero.Skill.dependency) =>
      switch (dep.target) {
      | One(_) => Some(dep.value)
      | Many(targets) =>
        targets
        |> Ley.List.delete(id)
        |> Ley.List.map(getValueForTargetId)
        // Check if the dependency is met by another entry so that it can be
        // ignored currently
        |> Ley.List.Foldable.any(value => value >= dep.value)
        |> (
          isMatchedByOtherEntry =>
            if (isMatchedByOtherEntry) {
              None;
            } else {
              Some(dep.value);
            }
        )
      },
    dependencies,
  );

let flattenActivatableSkill = (getValueForTargetId, id, dependencies) =>
  Hero.ActivatableSkill.(
    mapOption(
      (dep: dependency) =>
        switch (dep.target) {
        | One(_) => Some(dep.value)
        | Many(targets) =>
          targets
          |> Ley.List.delete(id)
          |> Ley.List.map(getValueForTargetId)
          // Check if the dependency is met by another entry so that it can be
          // ignored currently
          |> Ley.List.Foldable.any(value =>
               switch (value, dep.value) {
               // If dependency requires an active entry, the other entry must
               // have at least the required value
               | (Active(value), Active(depValue)) => value >= depValue
               // If the dependency requires an inactive entry, the other entry
               //  must be inactive as well
               | (Inactive, Inactive) => true
               // Otherwise the dependency is not met by the other entry
               | (Active(_), Inactive)
               | (Inactive, Active(_)) => false
               }
             )
          |> (
            isMatchedByOtherEntry =>
              if (isMatchedByOtherEntry) {
                None;
              } else {
                Some(dep.value);
              }
          )
        },
      dependencies,
    )
  );
