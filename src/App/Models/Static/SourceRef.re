type pages =
  | Page(int)
  | Pages(int, int);

[@gentype]
type t = {
  id: string,
  page: pages,
};
