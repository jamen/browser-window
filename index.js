const { BrowserWindow, app } = require('electron')
const assign = require('assign-deep')
const os = require('os')
const eventcb = require('event-callback')
const url = require('url')
function noop () {}

module.exports = create

function create (initOptions) {
  initOptions = assign({linuxFlags: true}, initOptions)

  // Enable command-line flags for transparent windows on some Linux DEs.
  if (initOptions.linuxFlags && os.platform() === 'linux') {
    if (!app.isReady()) app.commandLine.appendSwitch('enable-transparent-visuals')
    else throw new Error('Cannot enable transparent visuals flags after app is ready.')
  }

  // Custom browser window object
  function browser (winOptions) {
    winOptions = assign({ graceful: true }, winOptions)

    // Handle `browser-window` being passed as `parent`.
    if (winOptions.parent && winOptions.parent._native) {
      winOptions.parent = winOptions.parent._native
    }

    if (winOptions.graceful) winOptions.show = false

    // Create `BrowserWindow` backend.
    const window = new BrowserWindow(winOptions)

    if (winOptions.graceful) window.on('ready-to-show', function () { window.show() })

    // Method for loading urls or data.
    function load (source, options, callback = noop) {
      if (typeof options === 'function') callback = options, options = {}
      options = assign({type: null, encoding: 'base64'}, options)

      // Callback handler
      var contents = window.webContents
      eventcb(contents, 'did-finish-load', 'did-fail-load', callback)

      // Load source as data:
      if (options.type) {
        const data = Buffer.from(source).toString(options.encoding)
        return window.loadURL(`data:${options.type};${options.encoding},${data}`, options)
      }

      // Load source as URL:
      const protocol = url.parse(source).protocol
      if (!protocol) source = 'file://' + source
      return window.loadURL(source, options)
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
    return {load, send, subwindow, native: window}
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
