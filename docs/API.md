## API

### `browser-window`

The required module is a function you use to initialize.  You call it with an optional object for options:

```js
require('browser-window')({ ...options })
```

This returns `browser`, what you use to create windows.

#### Options

 - `linuxTransparencyFlags` (`Boolean`): Whether or not you want to have `--enable-transparent-visuals` ran for linux systems.  Defaults to `true`

#### Purpose

Why do you have to initialize the module?  Simply so we can run things before `app`'s 'ready' event.

For example, `linuxTransparencyFlags` uses functions which can't be run after the 'ready' event.  So we just need a simple initialization body.

### `browser([options])`

Creates a `window` with your given options.

```js
const window = browser({width: 100, height: 200})
```

#### Options

All options supplied are compatible with [`BrowserWindow`'s options](https://github.com/electron/electron/blob/master/docs/api/browser-window.md), in addition to some of our own:

 - TODO: Make custom options.

### `browser.frameless([options])`

An alias of `browser` that has default options for a [frameless window](https://github.com/electron/electron/blob/master/docs/api/frameless-window.md). Returns `window`.

```js
browser.frameless({width: 275, height: 75})
```

### `browser.transparent([options])`

An alias of `browser` that has default options for a [frameless and transparent background window](https://github.com/electron/electron/blob/master/docs/api/frameless-window.md#transparent-window).  Returns `window`.

```js
browser.transparent({width: 20, height: 20})
```

### `window`

The `window` object the `browser()` functions return.  Not to be confused with the [global `window` object](https://developer.mozilla.org/en-US/docs/Web/API/Window).

```js
const window = browser.transparent()
// Use the `window`
```


### `window.load(source, [options, callback])`

Load a webpage or data on the window.

 - `source` (`String`|`Buffer`): Some data or a URL that you want to load.
 - `options` (`Object`): Options to load data with.
 - `callback` (`Function`): Emitted after [`did-finish-load` or `did-fail-load`](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#event-did-finish-load) events.

```js
const window = browser({autoHideMenuBar: true})

// Load URL
window.load('https://github.com/', (err) => {
  console.log('Loaded')
})

// Load data
fs.readFile('image.png', (err, image) => {
  window.load(image, {type: 'image/png'})
})

// Or strings
window.load('<p>Hello world</p>', {type: 'text/html'})
```

#### Options

 - `type` (`String`): A MIME type of the data you are loading.  i.e. `text/html`, `text/plain`, `image/png`. If falsy the source is used as a URL.

### `window.send(channel, [...args])`

An alias of [`webContents.send`](https://github.com/electron/electron/blob/master/docs/api/web-contents.md#contentssendchannel-arg1-arg2-) on `BrowserWindow` to be more nice:

```js
window.send('some-name', 1, 2, 3)
```

See `webContents.send` docs for more info.

### `window.subwindow([options])`

Spawn and return a new `window` as a child of the window being called on.

 - `options` (`Object`): Same options as what you pass into `browser({ ... })`.

```js
const window = browser.frameless({width: 50, height: 50})

// Create new child window of parent window.
const child = window.subwindow()

child.load('<p>Hello world</p>', {type: 'text/html'})
```

### `window._native`

Access to the `BrowserWindow` object backing the `window`.

```js
window._native.loadURL('https://github.com/')
```
