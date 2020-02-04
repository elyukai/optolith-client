import { bindF, Either, Left, maybeToEither, Right } from "../../../../Data/Either"
import { equals } from "../../../../Data/Eq"
import { ident } from "../../../../Data/Function"
import { fmap } from "../../../../Data/Functor"
import { any, cons, empty, filter, flength, head, ifilter, ifoldr, imap, lines, List, map, notNull, notNullStr, replaceStr, splitOn, uncons, zip } from "../../../../Data/List"
import { ensure, mapMaybe } from "../../../../Data/Maybe"
import { fromList, OrderedMap } from "../../../../Data/OrderedMap"
import { show } from "../../../../Data/Show"
import { fst, Pair, second, snd } from "../../../../Data/Tuple"
import { pipe, pipe_ } from "../../pipe"

// const file = xlsx.readFile(`${dataSrcPath}TDE5.xlsx`);
// const allWorksheets = file.SheetNames.reduce((m, name) => {
//   return m.set(name, xlsx.utils.sheet_to_csv(file.Sheets[name], { FS: ';;',
// RS: '\n', blankrows: false }));
// }, new Map());

export type Row = OrderedMap<string, string>
export type Sheet = List<Row>

export const CsvColumnDelimiter = ";;"

const emptyColRegex = /(?:^(?:Spalte|Column)\d+$)|(?:^_)|(?:^$)/u

const unescapeStr =
  (x: string) => {
    const res = /^"(?<content>.+)"$/u .exec (x)

    if (res !== null && res .groups !== undefined && typeof res .groups .content === "string") {
      return replaceStr ("\"\"") ("\"") (res .groups .content)
    }

    return x
  }

const decodeLF = replaceStr ("\\n") ("\n")

const decode =
  pipe (
    ensure<Pair<string, string>> (pipe (snd, notNullStr)),
    fmap (second (pipe (unescapeStr, decodeLF)))
  )

/**
 * Converts a CSV string into a list of entries. If `check` is `True`, the line
 * length will be checked so there is no difference in length. Error info is
 * contained in the returned `Either`.
 */
export const csvToList =
  pipe (
    lines,

    // Split lines into columns
    map (splitOn (CsvColumnDelimiter)),

    // Ignore lines that are accidentially contained in CSV
    // => array of length 1, containing empty string
    filter<List<string>> (e => notNull (e) && head (e) .length > 0),

    // header and body
    uncons,

    x => x,

    maybeToEither ("csvToList: Empty file"),

    bindF (headerAndBody => {
            const header = fst (headerAndBody)

            const header_length = flength (header)

            const valid_headers =
              pipe_ (
                header,
                imap<string, Pair<number, string>> (Pair),
                filter (x => !emptyColRegex .test (snd (x)))
              )

            if (flength (valid_headers) === 0) {
              return Left (`csvToList: empty worksheet, table header: \n${show (header)}`)
            }

            const body = snd (headerAndBody)

            const filterValues =
              ifilter (i => (_: string) => any<Pair<number, string>> (pipe (fst, equals (i)))
                                                                     (valid_headers))

            const valid_header = map (snd) (valid_headers)

            return ifoldr (i => (values: List<string>): ident<Either<string, Sheet>> =>
                            bindF (
                              acc => flength (values) === header_length
                                ? Right (cons (acc)
                                              (fromList (mapMaybe (decode)
                                                                  (zip (valid_header)
                                                                       (filterValues (values))))))
                                : Left (`csvToList: Line ${i + 1} has different length than header. Check if there are any newline characters ("\\n") on that line. Source: ${show (values)}`)
                            ))
                          (Right (empty))
                          (body)
          })
  )
