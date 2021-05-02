# Generating module code

## Convert syntax

Using `bsrefmt`, you can convert between syntaxes:

```shell
./node_modules/.bin/bsrefmt path/to/file --print=syntax
```

`syntax` can be `res`, `re` and `ml`. The converted code from the referenced file will be output to command line.

## Interface files

Using `bsc`, you can generate an interface file in OCaml syntax if only the implementation file is present:

```shell
./node_modules/.bin/bsc ./lib/bs/path/to/file.cmi
```

To generate in Reason syntax, provide the `-bs-re-out` flag.

```shell
./node_modules/.bin/bsc -bs-re-out ./lib/bs/path/to/file.cmi
```

The generated code will be output to command line.
