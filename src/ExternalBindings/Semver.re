/**
 * Returns an array of prerelease components, or `null` if none exist.
 */
[@bs.module "semver"] [@bs.return null_to_opt]
external prerelease: string => option(array(string)) = "prerelease";
