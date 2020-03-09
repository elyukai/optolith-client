module Category = {
  [@genType "PatronCategory"]
  type t = {
    /**
     * The patron category's ID.
     */
    id: int,
    /**
     * The name of the patron category.
     */
    name: string,
    /**
     * The list of cultures where patrons from this category can be the primary
     * patron.
     */
    primaryPatronCultures: array(int),
  };
};

[@genType "Patron"]
type t = {
  /**
   * The patron's ID.
   */
  id: int,
  /**
   * The name of the patron.
   */
  name: string,
  /**
   * The category of the patron.
   */
  category: int,
  /**
   * The patron-specific skills.
   */
  skills: (int, int, int),
  /**
   * If defined, the patron is limited to the listed cultures.
   */
  limitedToCultures: array(int),
  /**
   * If `true`, the patron is limited to every culture *except* the listed
   * cultures in `limitedToCultures`. Does not have an effect if
   * `limitedToCultures` is not defined.
   */
  isLimitedToCulturesReverse: option(bool),
};
