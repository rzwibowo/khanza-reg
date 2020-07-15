const { app, BrowserWindow, Menu, ipcMain, shell } = require('electron')
const path = require('path')
const url = require('url')
const menu = require('./menu')
let mainWindow
let childWindow
let workerWindow
let editAkses

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        show: false,
        webPreferences: { nodeIntegration: true }
    })
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'index.html'),
        protocol: 'file',
        slashes: true
    }))

    childWindow = new BrowserWindow({
        parent: mainWindow,
        width: 400,
        height: 320,
        frame: false,
        resizable: false,
        webPreferences: { nodeIntegration: true }
    })
    childWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'login.html'),
        protocol: 'file',
        slashes: true
    }))

    workerWindow = new BrowserWindow({
        show: false,
        frame: false,
        resizable: false,
        webPreferences: { nodeIntegration: true }
    })
    workerWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'report.html'),
        protocol: 'file',
        slashes: true
    }))

    const menuitem = Menu.buildFromTemplate(menu.menu)
    Menu.setApplicationMenu(menuitem)
}

ipcMain.on('entry-accepted', (_event, arg) => {
    if (arg === 'ping') {
        mainWindow.maximize()
        childWindow.close()
    }
})

ipcMain.on('print', (_event, content) => {
    workerWindow.webContents.send('print', content)
})

ipcMain.on('readyToPrint', _event => {
    workerWindow.webContents.print({
        margins: {
            top: 0,
            left: 0
        }
    })
})

ipcMain.on('setAksesEdit', (_event, args) => {
    editAkses = args
})

ipcMain.on('getAksesEdit', event => {
    event.returnValue = editAkses
})

ipcMain.on('close', (_event, _arg) => {
    app.quit()
})

app.on('ready', createWindow)
