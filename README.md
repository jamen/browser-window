# browser-window [![NPM version](https://badge.fury.io/js/browser-window.svg)](https://npmjs.org/package/browser-window) [![Build Status](https://travis-ci.org/jamen/browser-window.svg?branch=master)](https://travis-ci.org/jamen/browser-window) [![experimental](http://badges.github.io/stability-badges/dist/experimental.svg)](http://github.com/badges/stability-badges)

> A helpful `BrowserWindow` wrapper.

```js
// Initialize module
const browser = require('browser-window')()

app.on('ready', () => {
  // Create browser window
  const window = browser({
    title: 'Hello world',
    width: 100,
    height: 100
  })

  // Load data
  window.load('<p>Hi, how are you?</p>', {type: 'text/html'})

  // Create children windows
  const child = window.subwindow({title: 'Foo bar'})

  // Send IPC messages
  child.send('some-message', 1, 2, 3)
})
```

## Installation

```sh
$ npm install --save browser-window
```

## Documentation

 - [API Docs](docs/API.md)
 - [Contributing](contributing.md)

## License

MIT © [Jamen Marz](https://github.com/jamen)
