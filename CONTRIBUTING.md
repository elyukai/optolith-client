# Contributing

## Reporting bugs

### 1. Does the issue is already reported?

[Check](https://github.com/elyukai/optolith-client/issues) if the issue you want to report already exists.

### 2. Do you need help?

Feel free to create a new issue and someone will help you! Give as much details as you think is needed but don't include irrelevant details.

### 3. Did you find a bug?

Please include the following:

- The version of the app you are using. You can find the version in the About > Third-party licenses section of the app.
- A *detailed* description of what you have done.
- What you expected to happen and what actually happened.

The Alpha version also provides access to the Chrome DevTools via the bug button in the top right corner. If you are not familiar with web development: Check if there are any errors shown in the Console tab. In that case please include the error message.

### 4. Do you have a suggestion?

You can suggest features either in the issues tracker or in one of the [listed forums](https://github.com/elyukai/optolith-client).

## Contributing code

- Due to licensing, the tables containing the crunch elements from the books is not included in this repository. Please join my [Discord Server](https://discord.gg/uDyR4yr) if you need access to them. Just text me in a channel on the server or PN me (@elyukai).
- Braches (mostly) follow Git Flow. Please try to follow Git Flow as well if you edit this repository.
- Please check out the [Style Guide](https://github.com/elyukai/optolith-client/wiki/Code-Style-Guide) for more information on that topic! Sadly, TSLint cannot ensure the whole style so you partially need to take care of that on your own!
- There is a page covering [Naming Conventions](https://github.com/elyukai/optolith-client/wiki/Naming-Conventions) as well!
- The key criteria for the project are mentioned in the [README](README.md). They also apply to pull requests. A feature usually does not consist of the technical part only. Much more important is how the feature presents itself to the user. And that must be planned and discussed.
- Code should follow functional programming practices while maintaining readablilty &ndash; which can be an issue using JavaScript/TypeScript, which is why in certain circumstances imperative/OOP code is allowed.
- The contribution has to be easy to understand not only for players using the app, but also for coders trying to further enhance the app: Please document module exports!

### Prepare the repo

Clone the repo.

```
$ git clone https://github.com/elyukai/optolith-client.git
```

Make sure Node.js (lastest version) is installed and run

```
$ npm i
```

This installs all necessary packages.

Create a `tablesSrc.json` in the `/deploy` folder. The JSON consists of an object that has the following interface:

```ts
{
  stable: string[];
  insider: string[];
}
```

Both list an array of strings that represents the path to a folder that contains the tables for stable or insider version, repectively. The array is consumed by `path.join` from Node.js in the end.

Example:

```json
{
  "stable": ["..", "OneDrive", "Optolith", "Data"],
  "insider": ["..", "OneDrive", "Optolith", "Data", "Insider"]
}
```

### First run

Compile the source code&hellip;

```
$ npm run compile
```

&hellip;or watch it for better performance for subsequent compiling on save.

```
$ npm run watch
```

Import stable or insider tables:

```
$ npm run copyTables
```

or

```
$ npm run copyTablesInsider
```

respectively.

Run the app:

```
$ npm start
```
