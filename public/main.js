const { app, BrowserWindow, shell, ipcMain, Menu } = require('electron')
const path = require('path')
const isDev = require('electron-is-dev')

let mainWindow

app.on('ready', () => {
  createWindow()

  Menu.setApplicationMenu(Menu.buildFromTemplate([{
    label: 'File',
    submenu: [
      { role: 'about' },
      { role: 'quit' }
    ]
  }, {
    label: 'Edit',
    submenu: [
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' }
    ]
  }, {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forcereload' },
      { role: 'toggledevtools' },
      { type: 'separator' },
      { role: 'resetzoom' },
      { role: 'zoomin' },
      { role: 'zoomout' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  }, {
    role: 'window',
    submenu: [
      { role: 'minimize' },
      { role: 'close' }
    ]
  }]))
})

app.on('window-all-closed', () => app.quit())
app.on('activate', () => mainWindow === null && createWindow())
ipcMain.on('load-page', (e, arg) => mainWindow.loadURL(arg))

function createWindow() {
  mainWindow = new BrowserWindow({
    backgroundColor: '#FFFFFF',
    show: false,
    minWidth: 800,
    minHeight: 600,
    center: true,
    title: "Premura",
    webPreferences: {
      nodeIntegration: false,
      preload: __dirname + '/preload.js'
    }
  })

  mainWindow.loadURL(
    isDev ? 'http://localhost:3000' : `file://${path.join(__dirname, '../build/index.html')}`
  )

  if (isDev) {
    const {
      default: installExtension,
      REACT_DEVELOPER_TOOLS
    } = require('electron-devtools-installer')

    installExtension(REACT_DEVELOPER_TOOLS)
    .then(name => console.log(`Added extension: ${name}`))
    .catch(err => console.log(`An error occurred: ${err}`))
  }

  mainWindow.once('ready-to-show', () => {
    mainWindow.show()
    ipcMain.on('open-external-window', (e, arg) => shell.openExternal(arg))
  })
}
