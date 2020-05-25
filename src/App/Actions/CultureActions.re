type action =
  | SetCulture(int)
  | SetCulturesSortOrder(FilterOptions.culturesSortOptions)
  | SetCulturesVisibilityFilter(FilterOptions.culturesVisibilityFilter)
  | SetCulturesFilterText(string);
