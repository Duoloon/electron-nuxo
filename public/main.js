const { app, BrowserWindow, Menu, ipcMain } = require('electron')
//const { autoUpdater } = require('electron-updater')
const path = require('path')
const isDev = require('electron-is-dev')
const WindowStateManager = require('electron-window-state-manager')
require('@electron/remote/main').initialize()
const iconPath = path.join(__dirname, 'images/favicon-16x16.png')

let template = []
if (process.platform === 'darwin') {
  // OS X
  const name = app.getName()
  template.unshift({
    label: name,
    submenu: [
      {
        label: 'About ' + name,
        role: 'about'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click() {
          app.quit()
        }
      }
    ]
  })
}

// let update;
let win

function sendStatusToWindow(option, text) {
  if (option === 'message') win.webContents.send('message', text)
}

const mainWindowState = new WindowStateManager('win', {
  defaultWidth: 1024,
  defaultHeight: 768
})

function createWindow() {
  // Create the browser window.
  // const menu = Menu.buildFromTemplate(template);
  // Menu.setApplicationMenu(menu);
  win = new BrowserWindow({
    width: mainWindowState.width,
    height: mainWindowState.height,
    x: mainWindowState.x,
    y: mainWindowState.y,
    icon: iconPath,
    webPreferences: {
      nodeIntegration: true,
      enableRemoteModule: false,
      contextIsolation: false
      // preload: path.join(__dirname, "preload.js"),
    }
  })
  
  // win.setMenu(null)

  win.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  )
}

app.on('ready', () => {
  createWindow()
  //autoUpdater.checkForUpdatesAndNotify()

  if (mainWindowState.maximized) {
    win.maximize()
  }
  // Don't forget to save the current state
  // of the Browser window when it's about to be closed
  win.on('close', () => {
    mainWindowState.saveState(win)
  })
})

// Quit when all windows are closed.
app.on('window-all-closed', function () {
  // On OS X it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', function () {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) createWindow()
})

/* autoUpdater.on('checking-for-update', () => {
  sendStatusToWindow('message', 'Verificando Actualización...')
})
autoUpdater.on('update-available', info => {
  sendStatusToWindow('message', 'Actualización Disponible.')
})
autoUpdater.on('update-not-available', info => {
  sendStatusToWindow('message', 'No hay Actualizaciones')
})
autoUpdater.on('error', err => {
  sendStatusToWindow(
    'message',
    'Ah Ocurrido un error al descargar la actualización' + err
  )
})
autoUpdater.on('download-progress', progressObj => {
  win.webContents.send('progressbar', progressObj.percent)
})
autoUpdater.on('update-downloaded', info => {
  sendStatusToWindow('message', 'Actualización Descargada')
})

ipcMain.on('restart_app', (event, arg) => {
  autoUpdater.quitAndInstall()
})

ipcMain.on('update_app', (event, arg) => {
  autoUpdater.checkForUpdates()
}) */
const server = require('./server')
