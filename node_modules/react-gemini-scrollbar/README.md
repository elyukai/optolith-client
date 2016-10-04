# react-gemini-scrollbar
[![npm-image](https://img.shields.io/npm/v/react-gemini-scrollbar.svg)](https://www.npmjs.com/package/react-gemini-scrollbar)
![license-image](https://img.shields.io/npm/l/react-gemini-scrollbar.svg)

React component for creating custom overlay-scrollbars with native scrolling mechanism for web applications (when needed)

**Important:**

- It only create the custom scrollbars (bind events, etc) when the OS does not supports “overlay-scrollbars” natively, otherwise leave the scrollbars intact
- IE9+ support

*Uses [gemini-scrollbar][1] under the hood, check the gemini-scrollbar [repo][1] for more information.*

## Install

**NPM**

```sh
npm install react-gemini-scrollbar --save
```

## Usage

**JSX**

```js
var GeminiScrollbar = require('react-gemini-scrollbar');

<GeminiScrollbar>
    <h1>The content.<h1>
    <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit.</p>
</GeminiScrollbar>
```

**Don’t forget the gemini stylesheet**

***NPM@2 located at:***

```
node_modules/react-gemini-scrollbar/node_modules/gemini-scrollbar/gemini-scrollbar.css
```

***NPM@3 located at:***

```
node_modules/gemini-scrollbar/gemini-scrollbar.css
```

## Props
* `autoshow`: show scrollbars upon hovering
* `forceGemini`: add option to force Gemini scrollbars even if native overlay-scrollbars are available


## Customization

You can change the styles of the scrollbars using CSS. Ex:

```css
/* override gemini-scrollbar default styles */

/* vertical scrollbar track */
.gm-scrollbar.-vertical {
  background-color: #f0f0f0
}

/* horizontal scrollbar track */
.gm-scrollbar.-horizontal {
  background-color: transparent;
}

/* scrollbar thumb */
.gm-scrollbar .thumb {
  background-color: rebeccapurple;
}
.gm-scrollbar .thumb:hover {
  background-color: fuchsia;
}
```

If you want to specify different scrollbar styles for your components, one
alternative is to pass a `className` to the component. Then you can use that
`className` as a namespace when writing your css. Ex:
```js
<GeminiScrollbar className='my-awesome-scrollbar'>...</GeminiScrollbar>
```

```css
.my-awesome-scrollbar .gm-scrollbar.-vertical {...}
.my-awesome-scrollbar .gm-scrollbar.-horizontal {...}
.my-awesome-scrollbar .gm-scrollbar .thumb {...}
```

## License
MIT © [Noel Delgado][0]

[0]: http://pixelia.me/
[1]: https://github.com/noeldelgado/gemini-scrollbar
