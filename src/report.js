const ipcRenderer = require('electron').ipcRenderer

function cardTemplate(data) {
    const template = `<h1>${data.no_rm}</h1>
    <h3>${data.nama}</h3>
    <p>${data.alamat}</p>
    <svg id="barkod"></svg>`
    return template
}

ipcRenderer.on('print', (_event, content) => {
    document.body.className = ''
    switch (content.type) {
        case 'card':
            document.body.classList.add('kartu')
            document.body.innerHTML = cardTemplate(content.data)
            JsBarcode('#barkod', content.data.no_rm)
            break
        default:
            document.body.innerHTML = ''
            break
    }
    ipcRenderer.send('readyToPrint')
})