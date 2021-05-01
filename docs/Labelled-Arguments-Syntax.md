# Labelled arguments syntax in OCaml

The syntax for labelled arguments might not always be obvious. Below you'll find a cheatsheet for the syntax in both implementations and signatures.

## Basic

### Definition

```ocaml
let f ~param:param = param
```

You can omit the variable name after the label itself if its the same as the label.

```ocaml
let f ~param = param
```

### Call

```ocaml
let x = f ~param:value
```

### Signature

```ocaml
val f : ~param:'a -> 'a
```

## Optional

```ocaml
let f ?param:param () = param
let f ?param () = param

val f : ?param:'a -> unit -> 'a
```

You can also provide a default value.

```ocaml
let f ?(param=0) () = param
let f ?param:(param=0) () = param
```

A function defining optional arguments must also define at least one non-labelled argument. A typical parameter for this use case is unit.

```ocaml
let f ?param () = param

let x = f () (* x = None *)
let x = f ~param:0 () (* x = Some 0 *)
```

You may also forward an optional type to an optional argument.

```ocaml
let f ?param () = param

let x = f () (* x = None *)
let x = f ?param:None () (* x = None *)
let x = f ?param:(Some 0) () (* x = Some 0 *)
```
