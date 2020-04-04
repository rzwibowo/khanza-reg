const ipcRenderer = require('electron').ipcRenderer

function cardTemplate(data) {
    const template = `
        <h1 class="rm">${data.no_rm}</h1>
        <h3 class="nama">${data.nama}</h3>
        <p class="alamat">${data.alamat}</p>
        <p class="data">${data.tgl_lahir}/${data.jk}/${data.jaminan}</p>
        <svg id="barkod"></svg>
        <small class="reg">Reg ${data.tgl_reg}</small>`
    return template
}

ipcRenderer.on('print', (_event, content) => {
    const report_el = document.getElementById('report')
    report_el.innerHTML = ''
    report_el.className = ''

    switch (content.type) {
        case 'card':
            report_el.classList.add('kartu')
            report_el.innerHTML = cardTemplate(content.data)
            JsBarcode('#barkod', content.data.no_rm, {
                width: 1.2,
                height: 30,
                marginTop: 0,
                marginBottom: 1,
                displayValue: false
            })
            break
        default:
            report_el.innerHTML = ''
            report_el.className = ''
            break
    }
    ipcRenderer.send('readyToPrint')
})