# Contributing

## Reporting bugs, feature requests and more

### 1. Is the issue already reported

[Check](https://github.com/elyukai/optolith-client/issues) if the issue you want to report already exists.

### 2. Do you need help

Feel free to create a new issue and someone will help you! Give as much details as you think is needed but don't include irrelevant details.

### 3. Did you find a bug

Please include the following:

- The version of the app you are using. You can find the version in the About > Third-party licenses section of the app.
- A *detailed* description of what you have done.
- What you expected to happen and what actually happened.

The Alpha version also provides access to the Chrome DevTools via the bug button in the top right corner. If you are not familiar with web development: Check if there are any errors shown in the Console tab. In that case please include the error message.

### 4. Do you have a suggestion

You can suggest features either in the issues tracker or in one of the [listed forums](https://github.com/elyukai/optolith-client).

## Contributing code

### Important note

Due to licensing, the YAML files containing the crunch elements from the books are **not** included in this repository but in a separate private one. Please join my [Discord Server](https://discord.gg/uDyR4yr) if you want to contribute and thus need to access them. Just text me in a channel on the server or PN me (@elyukai).

### Basic development rules

- Branches (mostly) follow Git Flow. Please try to follow Git Flow as well if you edit this repository. But if it's possible, please fork this repo and create PRs.
- Please check out the [Style Guide](https://github.com/elyukai/optolith-client/wiki/Code-Style-Guide) for more information on that topic! Sadly, TSLint cannot ensure the whole style so you partially need to take care of that on your own!
- There is a page covering [Naming Conventions](https://github.com/elyukai/optolith-client/wiki/Naming-Conventions) as well!
- The key criteria for the project are mentioned in the [README](README.md). They also apply to pull requests. A feature usually does not consist of the technical part only. Much more important is how the feature presents itself to the user. And that must be planned and discussed.
- Code should follow functional programming practices while maintaining readablilty &ndash; which can be an issue using JavaScript/TypeScript, which is why in certain circumstances imperative/OOP code is allowed. It is also possible to write Reason/OCaml code, which compiles to JS.
- The contribution has to be easy to understand not only for players using the app, but also for coders trying to further enhance the app: Please document at least module exports!

### Prepare the repo

Clone the repo, including the private submodule.

```sh
git clone --recurse-submodules https://github.com/elyukai/optolith-client.git
```

Make sure Node.js (lastest version) is installed and run

```sh
npm i
```

This installs all necessary packages.

### First run

Compile the source code. `js:` is for TypeScript/Webpack, `re:` for Reason/OCaml and `css:` for CSS/Sass. Webpack does not check the TypeScript validity, to check this, use `ts:` commands.

You have to run the Reason build first as it generates TypeScript files...

```sh
npm run re:build
npm run css:build
npm run js:build
```

(There's also a shorthand for that:)

```sh
npm run build
```

&hellip;or watch it for better performance for subsequent compiling on save (you need to use separate terminal instances then).

```sh
npm run re:watch
npm run css:watch
npm run js:watch
```

To check the TypeScript validity, either check once or watch for changes (I'd always recommend to do the latter one).

```sh
npm run ts:build
npm run ts:watch
```

Run the app:

```sh
npm start
```

### Stylesheets

To compile the SCSS files, use

```sh
npm run css:build
```

### Miscellaneous

Clean the files built by the Reason compiler, if there are any issue with it.

```sh
npm run re:clean
```

Lint all project TS files using ESLint.

```sh
npm run lint
```
