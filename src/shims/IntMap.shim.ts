type Empty = "EmptyIntMap"

type Node<a> = {
  tag: "IntMapNode"
  value: { l: t<a>; v: number; d: a; r: t<a>; h: number }
}

export type t<a> = Empty | Node<a>

export type empty = t<any>
