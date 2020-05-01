/**
 * `flattenDependencies(getValueForTargetId, id, dependencies)` flattens the
 * list of dependencies to usable values. That means, optional dependencies
 * (objects) will be evaluated and will be included in the resulting list,
 * depending on whether it has to follow the optional dependency or not. The
 * result is a plain `List` of all non-optional dependencies.
 */
let flatten = (getValueForTargetId, id, dependencies) =>
  Maybe.mapMaybe(
    (dep: Hero.Skill.dependency) =>
      switch (dep.target) {
      | One(_) => Just(dep.value)
      | Many(targets) =>
        targets
        |> ListH.delete(id)
        |> ListH.map(getValueForTargetId)
        |> ListH.Foldable.any(value => value >= dep.value)
        |> (
          isMatchedByOtherEntry =>
            if (isMatchedByOtherEntry) {
              Maybe.Nothing;
            } else {
              Just(dep.value);
            }
        )
      },
    dependencies,
  );
