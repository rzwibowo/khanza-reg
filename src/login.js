import Vue from './vendor/vue/vue.esm.browser.min.js'

const ipc = require('electron').ipcRenderer

new Vue({
    el: '#app',
    data: function () {
        return {
            username: '',
            password: '',
            udummy: 'userku',
            pdummy: 'passku',
            notif: ''
        }
    },
    methods: {
        login: function () {
            if (this.username === this.udummy && this.password === this.pdummy) {
                ipc.sendSync('entry-accepted', 'ping')
            } else {
                this.notif = 'Username atau Password salah'
            }
        },
        keluar: function () {
            ipc.sendSync('close')
        }
    }
})