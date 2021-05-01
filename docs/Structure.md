# Structure

- `src` – The source code main folder, containing program entry points.
  - `Common` – Types and functions associated with multiple ‘namespaces’.
  - `Database` – The flat-file database containing all static data from the source books.
  - `Dependencies` – Types and functions for working with dependencies between entries and the prerequisites they are based on.
  - `External` – Bindings to external libraries via FFI.
  - `Localization` – Types and functions related to different languages in the app and the source books.
  - `Rated` – All data types for entries with *ratings* (attributes, skills or combat techniques) and related types and logic.
  - `Rules` – All data types for rule entries.
  - `Sources` – Types and functions dealing with data related to source books: Source books themselves, references, availability by book and errata.
  - `Utilities` – Utility functions and types for working with standard types or I/O.
    - `Abstractions` – Utility functions and types for working with type abstractions such as monads that can be used to create similar functions for different container types.
