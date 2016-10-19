browser.frameless = frameless
browser.transparent = transparent
module.exports = browser
const { BrowserWindow, ipcMain } = require('electron')
const EventEmitter = require('events')
const fastArgs = require('fast-args')
const assign = require('assign-deep')

/**
 * Normal window
 */
function browser (windowOptions) {
  // Add defaults to window options.
  // windowOptions = assign({}, windowOptions)

  // Create window back-end with options
  const window = new BrowserWindow(windowOptions)

  // Load a URL, buffer, string, etc.
  function load (source, options) {
    options = assign({
      data: null,
      encoding: 'base64'
    }, options)

    // Encode to data URI
    if (options.data) {
      const data = Buffer.from(source).toString(options.encoding)
      window.loadURL(`data:${options.data};${options.encoding},${data}`)
    } else {
      window.loadURL(source)
    }
  }

  // Send an IPC message
  function send (...args) {
    return window.webContents.send(...args)
  }

  return { load, send }
}

/**
 * Frameless window
 */
function frameless (options) {
  options = Object.assign({
    frame: false
  }, options)

  // Create window
  return browser(options)
}

/**
 * Transparent window
 */
function transparent (options) {
  options = Object.assign({
    transparent: true
  }, options)

  // Create window
  return frameless(options)
}
