// import { Activatable } from "../../Models/Wiki/wikiTypeHelpers";
// import { ActiveObjectWithId } from "../../Models/ActiveEntries/ActiveObjectWithId";
// import { Record } from "../../../Data/Record";
// import { Maybe } from "../../../Data/Maybe";
// import { ActivatableDependent } from "../../Models/ActiveEntries/ActivatableDependent";
// import { HeroModelRecord } from "../../Models/Hero/HeroModel";
// import { addDependencies } from "../Dependencies/dependencyUtils";
// import { getCombinedPrerequisites } from "./activatableActivationUtils";
// import { RequireActivatable, reqToActive, reqToActiveFst } from "../../Models/Wiki/prerequisites/ActivatableRequirement";
// import { pipe } from "../pipe";
// import { isList, head } from "../../../Data/List";
// import { fmap } from "../../../Data/Functor";

// const RAA = RequireActivatable.A

// export const addActivatableDeep =
//   (x: Record<RequireActivatable>) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
//   (hero: HeroModelRecord) => {
//     const a = reqToActiveFst (x)

//     const combined_prereq = getCombinedPrerequisites (true)
//                                                      (wiki_entry)
//                                                      (mhero_entry)
//                                                      (a)

//     const curr_ids = RAA.id (x)
//     const curr_id = isList (curr_ids) ? head (curr_ids) : curr_ids

//     return pipe (
//       (hero: HeroModelRecord) =>
//       fmap (addDependencies (curr_id)
//                       (combined_prereq))
//     )
//   }


// /**
//  * Adds or removes active instance and related prerequisites based on passed
//  * functions.
//  * @param getActive
//  * @param changeDependencies
//  * @param changeActive
//  * @param add If an entry should be added or removed.
//  */
// const changeActiveLength =
//   (modifyDependencies: typeof addDependencies) =>
//   (modifyActiveObjects: ident<List<Record<ActiveObject>>>) =>
//   (add: boolean) =>
//   (entry: Record<ActiveObject>) =>
//   (wiki_entry: Activatable) =>
//   (mhero_entry: Maybe<Record<ActivatableDependent>>) =>
//   (hero: HeroModelRecord) =>
//                        // Source id
//     modifyDependencies (id (wiki_entry))

//                        // get the prerequisites that need to be applied as
//                        // dependencies to all objects the activation or
//                        // deactivation depends on
//                        (getCombinedPrerequisites (add)
//                                                  (wiki_entry)
//                                                  (mhero_entry)
//                                                  (entry))

//                        // modify the list of `ActiveObjects` and pass the hero
//                        // to `changeDependencies` so that it can apply all the
//                        // dependencies to the updated hero
//                        (adjustEntryDef (over (ActivatableDependentL.active) (modifyActiveObjects))
//                                        (id (wiki_entry))
//                                        (hero))

// /**
//  * Activates the entry with the given parameters and adds all needed
//  * dependencies.
//  * @param entry The `ActiveObject`.
//  */
// export const activateByObject =
//   (entry: Record<ActiveObject>) =>
//     changeActiveLength (addDependencies)
//                        (consF (entry))
//                        (true)
//                        (entry)
