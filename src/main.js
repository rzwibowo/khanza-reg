import Vue from './vendor/vue/vue.esm.browser.min.js'

import { MainT } from './components/template/MainT.js'
import { Reg } from './components/Reg.js'
import { RegBaru } from './components/RegBaru.js'
import { RegInap } from './components/RegInap.js'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: Reg
        },
        {
            path: '/regbaru',
            component: RegBaru
        },
        {
            path: '/reginap',
            component: RegInap
        }
    ]
});

new Vue({
    el: '#app',
    router,
    template: MainT
})