import Vue from './vendor/vue/vue.esm.browser.min.js'

const ipc = require('electron').ipcRenderer
const remote = require('electron').remote

import { dbUtil } from './dbconn.js'

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
        login: async function () {
            const db = new dbUtil()
            let res = null
            await db.doQuery(`select * from t_user where id_user = ${this.username} and username = '${this.password}'`, (data) => {
                res = JSON.parse(data)
                
                if (res.length !== 0) {
                    ipc.sendSync('entry-accepted', 'ping')
                } else {
                    this.w.setSize(400, 370)
                    this.notif = 'Username atau Password salah'
                }
            })
        },
        keluar: function () {
            ipc.sendSync('close')
        }
    }
})