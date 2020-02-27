module Parser = {
  type t =
    | Null
    | Bool(bool)
    | Float(float)
    | String(string)
    | Array(list(t))
    | Object(list((string, t)));

  type options = {
    /**
     * Default prefix for anchors. By default `'a'`, resulting in anchors `a1`,
     * `a2`, etc.
     */
    anchorPrefix: option(string),
    /**
     * Allow non-JSON JavaScript objects to remain in the `toJSON` output.
     * Relevant with the YAML 1.1 `!!timestamp` and `!!binary` tags. By default
     * `true`.
     */
    keepBlobsInJSON: option(bool),
    /**
     * Include references in the AST to each node's corresponding CST node. By
     * default `false`.
     */
    keepCstNodes: option(bool),
    /**
     * Store the original node type when parsing documents. By default `true`.
     */
    keepNodeTypes: option(bool),
    /**
     * When outputting JS, use `Map` rather than `Object` to represent mappings.
     * By default `false`.
     */
    mapAsMap: option(bool),
    /**
     * Prevent exponential entity expansion attacks by limiting data aliasing
     * count; set to `-1` to disable checks; `0` disallows all alias nodes. By
     * default `100`.
     */
    maxAliasCount: option(int),
    /**
     * Enable support for `<<` merge keys. By default `false` for YAML 1.2 and
     * `true` for earlier versions.
     */
    merge: option(bool),
    /**
     * Include line position & node type directly in errors; drop their verbose
     * source and context. By default `false`.
     */
    prettyErrors: option(bool),
    /**
     * When stringifying, require keys to be scalars and to use implicit rather
     * than explicit notation. By default `false`.
     */
    simpleKeys: option(bool),
    /**
     * The YAML version used by documents without a %YAML directive. By default
     * `"1.2"`.
     */
    version: option(string),
  };

  let defaultOptions = {
    anchorPrefix: None,
    keepBlobsInJSON: None,
    keepCstNodes: None,
    keepNodeTypes: None,
    mapAsMap: None,
    maxAliasCount: None,
    merge: None,
    prettyErrors: None,
    simpleKeys: None,
    version: None,
  };

  [@bs.module "yaml"]
  external jsParse: (string, options) => Js.Json.t = "parse";

  let parse = data => jsParse(data, defaultOptions);
  let parseWithOpts = jsParse;
};
