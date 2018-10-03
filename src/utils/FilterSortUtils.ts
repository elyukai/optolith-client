/**
 * TODO: Refactor the entire file to split the functions into smaller pieces and
 * to manually curry them.
 */

import { List, Maybe, Record } from './dataUtils';

export interface BaseObject {
  name: any;
  [key: string]: any;
}

export type AllSortOptions<T extends BaseObject> =
  (keyof T | SortOption<T>)[] | keyof T | SortOption<T>;

export type SortKeyFunction<T extends BaseObject, R = any> = (object: Record<T>) => R;
export type SortKeyType<T extends BaseObject> = keyof T | SortKeyFunction<T>;

export interface SortOption<T extends BaseObject> {
  key: SortKeyType<T>;
  keyOfProperty?: string;
  mapToIndex?: List<string>;
  reverse?: boolean;
}

type SortFunction<T> = (a: Record<T>, b: Record<T>) => number;

function keyIsFunction<T extends BaseObject> (key: SortKeyType<T>): key is SortKeyFunction<T> {
  return typeof key === 'function';
}

export const sortObjects = <T extends BaseObject>(
  list: List<Record<T>>,
  locale: string,
  sortOptions: AllSortOptions<T> = 'name'
): List<Record<T>> => {
  if (list.length () < 2) {
    return list;
  }

  const sortFunctions: SortFunction<T>[] = [];
  const firstItem = Maybe.listToMaybe (list);

  if (Maybe.isJust (firstItem)) {
    if (Array.isArray (sortOptions)) {
      for (const option of sortOptions) {
        const sortFunction = createSortFunction<T> (
          option,
          Maybe.fromJust (firstItem),
          locale
        );

        if (sortFunction) {
          sortFunctions.push (sortFunction);
        }
      }
    }
    else {
      const sortFunction = createSortFunction<T> (
        sortOptions,
        Maybe.fromJust (firstItem),
        locale
      );

      if (sortFunction) {
        sortFunctions.push (sortFunction);
      }
    }
  }

  return list.sortBy (a => b => {
    for (const compare of sortFunctions) {
      const result = compare (a, b);
      if (result !== 0) {
        return result;
      }
    }

    return 0;
  });
}

export interface FilterOptions<T> {
  addProperty?: keyof T;
  keyOfName?: string;
}

export const filterObjects = <T extends BaseObject>(
  list: List<Record<T>>,
  filterText: string,
  options: FilterOptions<T> = {}
): List<Record<T>> => {
  const { addProperty, keyOfName } = options;
  if (filterText !== '') {
    filterText = filterText.toLowerCase ();
    if (addProperty) {
      return list.filter ((obj: any) => {
        if (
          typeof obj.get ('name') === 'object'
          && typeof obj.get (addProperty) === 'object'
          && keyOfName
        ) {
          return (obj.get ('name').get (keyOfName) as string).toLowerCase ().includes (filterText)
            || (obj.get (addProperty).get (keyOfName) as string)
              .toLowerCase ()
              .includes (filterText);
        }
        else if (
          typeof obj.get ('name') === 'object'
          && typeof obj.get (addProperty) === 'string'
          && keyOfName
        ) {
          return (obj.get ('name').get (keyOfName) as string).toLowerCase ().includes (filterText)
            || (obj.get (addProperty) as string).toLowerCase ().includes (filterText);
        }
        else if (
          typeof obj.get ('name') === 'string'
          && typeof obj.get (addProperty) === 'object'
          && keyOfName
        ) {
          return obj.get ('name').toLowerCase ().includes (filterText)
            || (obj.get (addProperty).get (keyOfName) as string)
              .toLowerCase ()
              .includes (filterText);
        }
        else if (
          typeof obj.get ('name') === 'string'
          && typeof obj.get (addProperty) === 'string'
        ) {
          return obj.get ('name').toLowerCase ().includes (filterText)
            || (obj.get (addProperty) as string).toLowerCase ().includes (filterText);
        }
        else if (typeof obj.get ('name') === 'object' && keyOfName) {
          return (obj.get ('name').get (keyOfName) as string).toLowerCase ().includes (filterText);
        }
        else if (typeof obj.get ('name') === 'string') {
          return obj.get ('name').toLowerCase ().includes (filterText);
        }

        return true;
      });
    }

    return list.filter ((obj: any) => {
      if (typeof obj.get ('name') === 'object' && keyOfName) {
        return (obj.get ('name').get (keyOfName) as string).toLowerCase ().includes (filterText);
      }
      else if (typeof obj.get ('name') === 'string') {
        return obj.get ('name').toLowerCase ().includes (filterText);
      }

      return true;
    });
  }

  return list;
}

const isSortOptionType = <T extends BaseObject>(
  test: AllSortOptions<T> | FilterOptions<T> | undefined
): test is AllSortOptions<T> =>
  Array.isArray (test)
  || typeof test === 'string'
  || typeof test === 'object' && test.hasOwnProperty ('key');

export function filterAndSortObjects<T extends BaseObject> (
  list: List<Record<T>>,
  locale: string,
  filterText: string,
  filterOptions: FilterOptions<T>
): List<Record<T>>;
export function filterAndSortObjects<T extends BaseObject> (
  list: List<Record<T>>,
  locale: string,
  filterText: string,
  sortOptions?: AllSortOptions<T>,
  filterOptions?: FilterOptions<T>
): List<Record<T>>;
export function filterAndSortObjects<T extends BaseObject> (
  list: List<Record<T>>,
  locale: string,
  filterText: string,
  sortOrFilterOptions?: AllSortOptions<T> | FilterOptions<T>,
  filterOptions?: FilterOptions<T>
): List<Record<T>> {
  let sortOptionsFinal: AllSortOptions<T> | undefined;
  let filterOptionsFinal: FilterOptions<T> | undefined;

  if (isSortOptionType (sortOrFilterOptions)) {
    sortOptionsFinal = sortOrFilterOptions;
  }
  else if (sortOrFilterOptions !== undefined) {
    filterOptionsFinal = sortOrFilterOptions;
  }
  if (filterOptions && !filterOptionsFinal) {
    filterOptionsFinal = filterOptions;
  }

  return sortObjects (
    filterObjects (list, filterText, filterOptionsFinal),
    locale,
    sortOptionsFinal
  );
}

export const sortStrings = (localeId: string) => (list: List<string>) =>
  list.sortBy (a => b => a.localeCompare (b, localeId));

export function filterStrings (list: List<string>, filterText: string) {
  if (filterText !== '') {
    filterText = filterText.toLowerCase ();

    return list.filter (e => e.toLowerCase ().includes (filterText));
  }

  return list;
}

export function filterAndSortStrings (list: List<string>, locale: string, filterText: string) {
  return sortStrings (locale) (filterStrings (list, filterText));
}

const isSortOptionObject = <T extends BaseObject>(
  option: keyof T | SortOption<T>
): option is SortOption<T> =>
  typeof option === 'object';

const createSortOptionObjectFunction = <T extends BaseObject>(
  option: SortOption<T>,
  firstItem: Record<T>,
  locale: string
): SortFunction<T> | undefined => {
  const { key, mapToIndex, reverse, keyOfProperty } = option;
  const propertyType = keyIsFunction (key)
    ? typeof key (firstItem)
    : typeof firstItem.get (key as any);
  if (reverse === true) {
    if (keyIsFunction (key)) {
      if (propertyType === 'string') {
        return (a, b) => key (a).localeCompare (key (b), locale) * -1;
      }
      else if (propertyType === 'number') {
        return (a, b) => key (b) - key (a);
      }
    }
    else if (keyOfProperty !== undefined) {
      return (a, b) => (
        typeof a.get (key as any) === 'object'
          ? a.get (key as any).get (keyOfProperty) as string
          : a.get (key as any) as string
      )
        .localeCompare (
          typeof b.get (key as any) === 'object'
            ? b.get (key as any).get (keyOfProperty) as string
            : b.get (key as any) as string,
          locale
        ) * -1;
    }
    else if (propertyType === 'string') {
      return (a, b) => (a.get (key as any) as string)
        .localeCompare (b.get (key as any), locale) * -1;
    }
    else if (propertyType === 'number' && mapToIndex !== undefined) {
      return (a, b) => Maybe.fromMaybe (0) (
        mapToIndex.subscript (a.get (key as any) as number - 1).bind (
          mappedA => mapToIndex.subscript (b.get (key as any) as number - 1).fmap (
            mappedB => mappedA.localeCompare (mappedB, locale) * -1
          )
        )
      );
    }
    else if (propertyType === 'number') {
      return (a, b) => (b.get (key as any) as number) - (a.get (key as any) as number);
    }
  }
  else if (keyIsFunction (key)) {
    if (propertyType === 'string') {
      return (a, b) => key (a).localeCompare (key (b), locale);
    }
    else if (propertyType === 'number') {
      return (a, b) => key (a) - key (b);
    }
  }
  else if (keyOfProperty !== undefined) {
    return (a, b) => {
      if (a.get (key as any) === undefined) {
        return 0;
      }

      const astring = typeof a.get (key as any) === 'object'
        ? a.get (key as any).get (keyOfProperty) as string
        : a.get (key as any) as string;

      const bstring = typeof b.get (key as any) === 'object'
        ? b.get (key as any).get (keyOfProperty) as string
        : b.get (key as any) as string;

      return astring.localeCompare (bstring, locale);
    };
  }
  else if (propertyType === 'string') {
    return (a, b) => (a.get (key as any) as string).localeCompare (b.get (key as any), locale);
  }
  else if (propertyType === 'number' && mapToIndex !== undefined) {
    return (a, b) => Maybe.fromMaybe (0) (
      mapToIndex.subscript (a.get (key as any) as number - 1).bind (
        mappedA => mapToIndex.subscript (b.get (key as any) as number - 1).fmap (
          mappedB => mappedA.localeCompare (mappedB, locale)
        )
      )
    );
  }
  else if (propertyType === 'number') {
    return (a, b) => (a.get (key as any) as number) - (b.get (key as any) as number);
  }

  return;
};

const createSortFunction = <T extends BaseObject>(
  option: keyof T | SortOption<T>,
  firstItem: Record<T>,
  locale: string
): SortFunction<T> | undefined => {
  if (isSortOptionObject (option)) {
    return createSortOptionObjectFunction (option, firstItem, locale);
  }
  else {
    const propertyType = typeof firstItem.get (option as any);
    if (propertyType === 'string') {
      return (a, b) => (a.get (option as any) as string)
        .localeCompare (b.get (option as any), locale);
    }
    else if (propertyType === 'number') {
      return (a, b) => (a.get (option as any) as number) - (b.get (option as any) as number);
    }
  }

  return;
};
