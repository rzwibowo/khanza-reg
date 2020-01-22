const { electron, app, BrowserWindow, Menu, ipcMain } = require('electron')
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

    const menu = Menu.buildFromTemplate([
        {
            label: 'Aplikasi',
            submenu: [
                {
                    label: 'Toggle Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click(item, focusedWindow) {
                        if (focusedWindow) focusedWindow.webContents.toggleDevTools()
                    }
                },
                {
                    label: 'Keluar',
                    click() {
                        app.quit()
                    }
                }
            ]
        },
        {
            label: 'Pelayanan',
            submenu: [
                {
                    label: 'Rawat Jalan'
                },
                {
                    label: 'Rawat Inap'
                }
            ]
        },
        {
            label: 'Tentang',
            click(menuItem, browserWindow, event) {
                browserWindow.loadURL(`file://${__dirname}/index.html#/about`)
            }
        }
    ])
    Menu.setApplicationMenu(menu)
}

ipcMain.on('entry-accepted', (event, arg) => {
    if (arg === 'ping') {
        mainWindow.maximize()
        childWindow.close()
    }
})

ipcMain.on('close', (event, arg) => {
    app.quit()
})

app.on('ready', createWindow)
