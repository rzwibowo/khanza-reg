const { electron, app, BrowserWindow, ipcMain } = require('electron')
const path = require('path')
const url = require('url')

let mainWindow
let childWindow

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
}

ipcMain.on('entry-accepted', (event, arg) => {
    if (arg === 'ping') {
        mainWindow.show()
        childWindow.close()
    }
})

ipcMain.on('close', (event, arg) => {
    app.quit()
})

app.on('ready', createWindow)
