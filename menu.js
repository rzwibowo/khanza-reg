const { app } = require('electron')

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
]

exports.menu = menu_