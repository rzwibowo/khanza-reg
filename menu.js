const { app, dialog } = require('electron')
const shell = require('electron').shell
const name = require('./package.json').name
const version = require('./package.json').version

const menu_ = [
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
                label: 'Rawat Jalan',
                click(menuItem, browserWindow, event) {
                    browserWindow.loadURL(`file://${__dirname}/index.html#/`)
                }
            },
            {
                label: 'Rawat Inap',
                click(menuItem, browserWindow, event) {
                    browserWindow.loadURL(`file://${__dirname}/index.html#/reginap`)
                }
            }
        ]
    },
    {
        label: 'Info Aplikasi',
        submenu: [
            {
                label: 'Developer',
                click() {
                    shell.openExternal('https://wibowo-dev.web.app')
                }
            },
            {
                label: 'SIMRS Khanza',
                click() {
                    shell.openExternal('https://github.com/mas-elkhanza/SIMRS-Khanza')
                }
            },
            {
                type: 'separator'
            },
            {
                label: 'Tentang Aplikasi',
                click() { dialog.showMessageBox(null, options) }
            }
        ]
    }
]

const options = {
    type: 'info',
    title: 'Tentang khanza-reg',
    message: `${name} version ${version}`,
    detail: `Made with ❤ by Wibowo Dev
In collaboration with Unit SIMRS RSI Wonosobo
Based on SIMRS Khanza
© 2019 - ${(new Date()).getFullYear()}`
}

exports.menu = menu_