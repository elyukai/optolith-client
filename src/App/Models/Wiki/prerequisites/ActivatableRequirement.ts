import * as RePrerequisites from "../../Static_Prerequisites.gen"

export type ActivatablePrerequisite = RePrerequisites.ActivatablePrerequisite
export type ActivatableMultiEntryPrerequisite = RePrerequisites.ActivatableMultiEntryPrerequisite
export type ActivatableMultiSelectPrerequisite = RePrerequisites.ActivatableMultiSelectPrerequisite

// export const reqToActiveFst =
//   (x: Record<RequireActivatable>) =>
//     ActiveObject ({
//       sid: fmapF (RAA.sid (x)) (curr_sid => isList (curr_sid) ? head (curr_sid) : curr_sid),
//       sid2: RAA.sid2 (x),
//       tier: RAA.tier (x),
//     })

// export const reqToActive =
//   (x: ActivatablePrerequisite): ActiveObject =>
//     ({
//       sid: x.sid,
//       sid2: PRAA.sid2 (x),
//       tier: PRAA.tier (x),
//     })
