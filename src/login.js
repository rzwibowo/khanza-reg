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
            notif: '',
            w: remote.getCurrentWindow()
        }
    },
    mounted: function () {
        this.$refs.username.focus()
    },
    methods: {
        login: function () {
            const db = new dbUtil()
            let resAdmin = null
            let resUser = null
            db.doQuery(`SELECT * 
                FROM admin 
                WHERE usere=AES_ENCRYPT('${this.username}','nur') 
                    AND passworde=AES_ENCRYPT('${this.password}','windi')`)
                .then(res => { 
                    resAdmin = res
                    return db.doQuery(`SELECT * 
                        FROM user 
                        WHERE id_user=AES_ENCRYPT('${this.username}','nur') 
                            AND password=AES_ENCRYPT('${this.password}','windi')`) 
                })
                .then(res => {
                    resUser = res
                    
                    if (resAdmin.length !== 0 || resUser.length !== 0) {
                        ipc.sendSync('entry-accepted', 'ping')
                    } else {
                        this.w.setSize(400, 370)
                        this.notif = 'Username atau Password salah'
                    }

                    return db.closeDb()
                }, err => {
                    return db.closeDb().then(() => { throw err })
                })
                .catch(err => console.error(err))

        },
        keluar: function () {
            ipc.sendSync('close')
        }
    }
})