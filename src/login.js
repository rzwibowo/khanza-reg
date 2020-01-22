import Vue from './vendor/vue/vue.esm.browser.min.js'

const ipc = require('electron').ipcRenderer
const remote = require('electron').remote

new Vue({
    el: '#app',
    data: function () {
        return {
            username: '',
            password: '',
            udummy: 'userku',
            pdummy: 'passku',
            notif: '',
            w: remote.getCurrentWindow()
        }
    },
    mounted: function() {
        this.$refs.username.focus()
    },
    methods: {
        login: function () {
            if (this.username === this.udummy && this.password === this.pdummy) {
                ipc.sendSync('entry-accepted', 'ping')
            } else {
                this.w.setSize(400, 370)
                this.notif = 'Username atau Password salah'
            }
        },
        keluar: function () {
            ipc.sendSync('close')
        }
    }
})