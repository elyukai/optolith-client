/**
 * `getDirectoryContents dir` returns a list of *all* entries in `dir`.
 */
let getDirectoryContents = dir => Node.Fs.readdirSync(dir) |> Array.to_list;
