module.exports = create
const { BrowserWindow, app } = require('electron')
const assign = require('assign-deep')
const os = require('os')
function noop () {}

function create (initOptions) {
  initOptions = assign({
    linuxTransparencyFlags: true
  }, initOptions)

  // Enable command-line flags for transparent windows on some Linux DEs.
  if (initOptions.linuxTransparencyFlags && os.platform() === 'linux') {
    if (!app.isReady()) app.commandLine.appendSwitch('enable-transparent-visuals')
    else throw new Error('Cannot enable transparent visuals flags after app is ready.')
  }

  // Custom browser window object
  function browser (windowOptions) {
    windowOptions = assign({}, windowOptions)

    // Handle `browser-window` being passed as `parent`.
    if (windowOptions.parent && windowOptions.parent._native) {
      windowOptions.parent = windowOptions.parent._native
    }

    // Create `BrowserWindow` backend.
    const window = new BrowserWindow(windowOptions)

    // Method for loading urls or data.
    function load (source, options, callback = noop) {
      if (typeof options === 'function') {
        callback = options
        options = {}
      }
      options = assign({type: null, encoding: 'base64'}, options)

      // Callback handlers
      window.webContents.once('did-finish-load', successHandler)
      window.webContents.once('did-fail-load', failHandler)
      function failHandler (event, code, desc) {
        window.webContents.removeListener('did-finish-load', successHandler)
        callback(new Error(`${code}: ${desc}`))
      }
      function successHandler () {
        window.webContents.removeListener('did-fail-load', failHandler)
        callback(null)
      }

      // Load source depending on type.
      if (options.type) {
        // Load data as type.
        const data = Buffer.from(source).toString(options.encoding)
        window.loadURL(`data:${options.type};${options.encoding},${data}`, options)
      } else {
        // Load as URL if no type provided.
        window.loadURL(source, options)
      }
    }

    // Send IPC messages
    function send (...args) {
      return window.webContents.send(...args)
    }

    // Create a child window
    function subwindow (options) {
      return browser(assign({ parent: window }, options))
    }

    // Return methods
    return {load, send, subwindow, _native: window}
  }

  // Frameless window alias
  function frameless (options) {
    return browser(assign({frame: false}, options))
  }

  // Transparent window alias
  function transparent (options) {
    return frameless(assign({transparent: true}, options))
  }

  // Set methods and return
  browser.frameless = frameless
  browser.transparent = transparent
  return browser
}
