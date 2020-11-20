type t('a) = Js.Promise.t('a);

type io('a) = t('a);

include Ley_Functor.T with type t('a) := t('a);
include Ley_Monad.T with type t('a) := t('a);

/**
 * Maps a function over all values of the list. Returns an `IO` of the
 * results. If one of the `IO`s contains an exception, the first exception
 * will be returned.
 */
let mapM: ('b => Js.Promise.t('a), list('b)) => Js.Promise.t(list('a));

/**
 * Maps a function over all values of the list. Returns an `IO` of the
 * results. If one of the `IO`s contains an exception, the first exception
 * will be returned.
 */
let imapM:
  ((int, 'b) => Js.Promise.t('a), list('b)) => Js.Promise.t(list('a));

/**
 * Maps a function over all values of the list. Returns an `IO` of the
 * results. If one of the `IO`s contains an exception, the first exception
 * will be returned.
 */
let imapOptionM:
  ((int, 'b) => Js.Promise.t(option('a)), list('b)) =>
  Js.Promise.t(list('a));

type filePath = string;

/**
 * The `readFile` function reads a file and returns the contents of the file as
 * a string.
 */
let readFile: filePath => t(string);

/**
 * The computation `writeFile file str` function writes the string `str`, to the
 * file `file`.
 */
let writeFile: (filePath, string) => t(unit);

/**
 * The computation `deleteFile file` function deletes the file `file`.
 */
let deleteFile: filePath => t(unit);

/**
 * The computation `existsFile file` function checks if the file `file` exists.
 */
let existsFile: filePath => t(bool);

/**
 * The computation `copyFile origin dest` function copies the file `origin` to
 * `dest`.
 */
let copyFile: (filePath, filePath) => t(unit);

/**
 * `mkdir path` creates the directory at the specified path.
 */
let mkdir: filePath => t(unit);

module Infix: {
  include Ley_Functor.Infix with type t('a) := t('a);
  include Ley_Monad.Infix with type t('a) := t('a);
};
