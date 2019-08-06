# Contributing

Es gibt ein paar Richtlinien fürs Helfen beim Coden:

- Der Code steht unter der Lizenz des Scriptoriums, weshalb diese Repo auch privat ist. Wird dieses Repo geforkt, **muss** das geforkte Repo auch privat sein. Eine Verwendung außerhalb dessen ist nicht möglich.
- Bitte schaut, dass der beigesteuerte Code dem Stil des bisherigen Codes entspricht. Ich habe mich für keinen verfügbaren Styleguide entscheiden können und mit Helfern wie Prettier konnte ich mich - bis jetzt - auh noch nicht anfreunden.
- Der **develop**-Branch ist der Arbeitsbranch. Codeänderungen - also Pull Requests - führen meistens darauf zurück.
- Der Masterbranch wird nur für Releases verwendet (das aber erst, nachdem die Beta fertig ist). Diese bekommen dann auch ihre eigenen temporären Branches, bei denen nur noch Bugfixes einfließen dürfen.
- Es ließ sich nicht einstellen, daher hier noch einmal schriftlich: Ich möchte jede Pull Request, die als Zielbranch **master**, **develop** oder einen von mir erstellten Branch hat, reviewen.
- Bitte schreibt nach Möglichkeit JSDoc Texte für neue Funktionen. Ich bin auch dabei, dass für alte Funktionen nachzuholen. Es ist jetzt nicht essenziell, wäre aber zum Verständnis besser! :)
- Solange #1 (Use Redux instead of Flux) noch aktiv ist, solltet ihr von dem **electron-redux**-Branch abbranchen, so ihr denn in dieser Repo arbeitet.

Ich habe das jetzt einfach etwas direkter formuliert, da ich bei solchen Geschichten ungern um den heißen Brei herum rede! ;)

An dieser Stelle auch Vielen Dank an alle Helfer!

P.S.: Ich sollte an dieser Stelle noch erwähnen, dass ich bis jetzt noch keine Erfahrung gesammelt habe, was kollaboratives Coden angeht. Ich bin auch bis zuletzt nicht davon ausgegangen, dass ich mal nicht der einzige sein werde, der an diesem Projekt arbeiten würde. Es mag daher sein, dass ihr Dateien findet, die etwas älter sind. Ich hoffe trotzdem, dass ihr euch zurechtfindet, da ich momentan nicht die Zeit habe, um alles durchzugehen (man kann ja schon am Switch zu Redux sehen, wie lange alles gedauert hat und wie viel Zeit ich entsprechend hatte). Erstellt bei Fragen/Unklarheiten einfach einen Issue! :)

## Coding Style

Please follow the (AirBnb Style Guide)[https://github.com/airbnb/javascript]. There are, however, some exceptions. If you find any code does not follow the guidelines linked and specified below, please either create a new issue or fork and create a new pull request.

### `if`-`else`

`else if` or `else` must start on a new line.

```ts
// bad
if (condition) {
  expression;
} else {
  expression;
}

// bad
if (condition)
{
  expression;
}
else
{
  expression;
}

// good
if (condition) {
  expression;
}
else {
  expression;
}
```

### Ternary Operator

`?` and `:` must start on a new line if the expression is too long to fit one line.

```ts
// bad
condition ?
expression :
expression

// good
condition
? expression
: expression

// also good
condition
  ? expression
  : expression

// best (but requires the whole construct to fit one line)
condition ? expression : expression
```

### Curried functions

Functions (and methods) have to be fully curried. There should not be partial function application, as this would cause different possibilities in calling functions. I want to enforce one style:

```ts
const add = (a: number) => (b: number) => a + b;

// worst
const addedNumbers = add(2)(3);

// still bad
const addedNumbers = add(2) (3);

// still bad
const addedNumbers = add (2)(3);

// good
const addedNumbers = add (2) (3);

// multiline
const addedNumbers = add (2)
                         (3);

// or
const addedNumbers =
  add (2)
      (3);

// or
const addedNumbers =
  add
    (2)
    (3);
```

This style is readable while having curried functions. It's derived from the Haskell style of calling functions, where the arguments are separate by one whitespace as well:

```hs
add :: Int -> Int -> Int

add 2 3
```

**Fun fact:** `add (2) (3)` is valid Haskell, it just contains unnecessary groupings.

#### Function calls as a parameter

```ts
// good
const x = myFunction (otherFunc ("Hi")) (3);

// good (such line breaks (compare to above) are usually needed either because of readability or because the line would be too long otherwise)
const x = myFunction (otherFunc ("Hi"))
                     (3);

// also good
const x = myFunction (otherFunc ("Hi")
                                ("Other string"))
                     (3);

// also good
const x = myFunction (otherFunc ("Hi") ("Other string"))
                     (3);

// bad
const x = myFunction (otherFunc ("Hi")
                                ("Other string")) (3);

// very bad ("Other string" seems to be a param of myFunction but its not)
const x = myFunction (otherFunc ("Hi")
                     ("Other string")) (3);
```

### Methods

If you need to use a class (e.g. the custom data structures *Maybe*, *List* a.s.o. are implemented as classes, consider the following styistic rules for using methods:

```ts
// bad
maybeValue.fmap(R.inc)

// still bad
maybeValue.fmap (R.inc)

// still bad
maybeValue .fmap(R.inc)

// good
maybeValue .fmap (R.inc)
```

This way, a method seems to be more like an infix function. Instance methods are always curried, too.

```ts
// very bad
Maybe.fmap(R.inc)(maybeValue)

// still bad
Maybe.fmap (R.inc) (maybeValue)

// still bad
Maybe .fmap (R.inc) (maybeValue)

// good
Maybe.fmap (R.inc) (maybeValue)
```

Static methods do not need a space before the dot because `Maybe` is no value. So `Maybe.fmap` as a whole is the function (name).

This way, you can also better differenciate between static and instance methods.

### Function declarations

Do not use named function expressions if using `function`, e.g. `const fn = function longFunctionName () { ... }`. Prefer arrow functions, which must be declared using `const fn = () => { ... }`, though.

### Arrow functions

Concerning (Arrow Functions 8.4)[https://github.com/airbnb/javascript#arrows--one-arg-parens]: Only use parentheses when there is more than one argument, do not use even if the function uses braces (actually you don't need parentheses at all, because all functions should be curried).

### Modules

Concerning (Modules 10.2)[https://github.com/airbnb/javascript#modules--no-wildcard]: Use wildcards when there are too many imports or for the sake of consistency across files (especially used for files in `src/types`, e.g. `* as Wiki`).

Concerning (Modules 10.3)[https://github.com/airbnb/javascript#modules--no-export-from-import]: Prefer shorter syntax.

Concerning (Modules 10.6)[https://github.com/airbnb/javascript#modules--prefer-default-export]: Do not use default exports, as possible renaming cannot benefit from TypeScript's ability to find all symbol references.

Concerning (Arrow Functions 10.8)[https://github.com/airbnb/javascript#modules--multiline-imports-over-newlines]: Put everything on one line, as it is more compact. TypeScript warns when there are missing or unnecessary imports anyway.

### Unimportant rules

- (Object 3.5)[https://github.com/airbnb/javascript#objects--grouped-shorthand]: Group object shorthand properties
- (Arrow Functions 8.3)[https://github.com/airbnb/javascript#arrows--paren-wrap]: Wrap expression in parentheses
- (Arrow Functions 8.5)[https://github.com/airbnb/javascript#arrows--confusing]: Avoid confusing arrow function syntax with comparison operators
- (Arrow Functions 8.6)[https://github.com/airbnb/javascript#whitespace--implicit-arrow-linebreak]: Enforce the location of arrow function bodies with implicit returns
- (Variables 13.3)[https://github.com/airbnb/javascript#variables--const-let-group]: Group `const`s and `let`s
- (Comparison 15.8)[https://github.com/airbnb/javascript#comparison--no-mixed-operators]: Enclose mixing operators in parentheses

### TSLint

A lot of areas are already covered by TSLint and it's plugins. Please use TSLint, it makes following the guidelines a lot easier!
