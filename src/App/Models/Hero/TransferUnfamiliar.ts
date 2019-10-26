import { fromDefault } from "../../../Data/Record";

/**
 * The `TransferUnfamiliar` record describes a spell by `id` that is not an
 * unfamiliar spell anymore, because it has been transferred into a familiar
 * tradition by an entry specified by `srcId`.
 *
 * If `id` is `true`, it means all unfamiliar spells are transferred into a
 * familiar tradition.
 */
export interface TransferUnfamiliar {
  "@@name": "TransferUnfamiliar"
  id: string | UnfamiliarGroup
  srcId: string
}

export enum UnfamiliarGroup {
  Spells,
  Chants,
}

export const TransferUnfamiliar =
  fromDefault ("TransferUnfamiliar")
              <TransferUnfamiliar> ({
                id: "",
                srcId: "",
              })
