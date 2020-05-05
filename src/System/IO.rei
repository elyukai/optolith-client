type t('a) = Js.Promise.t('a);

type io('a) = t('a);

module Functor: {
  /**
   * Maps a function over the result of an IO action.
   */
  let (<$>): ('a => 'b, t('a)) => t('b);

  let (<&>): (t('a), 'a => 'b) => t('b);
};

module Monad: {
  /**
   * Lift a value to an IO.
   */
  let pure: 'a => t('a);

  /**
   * Maps a function that executes an IO action over the result of another IO
   * action.
   */
  let (>>=): (t('a), 'a => t('b)) => t('b);

  /**
   * Maps a function that executes an IO action over the result of another IO
   * action.
   */
  let (=<<): ('a => t('b), t('a)) => t('b);
};

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
