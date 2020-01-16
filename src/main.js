import Vue from './vendor/vue/vue.esm.browser.min.js'

import { NavBarT } from './components/NavBarComp.js'
import { AboutT } from './components/AboutComp.js'
import { MainT } from './components/template/MainT.js'
import { RegComp } from './components/RegComp.js'

Vue.use(VueRouter)

const router = new VueRouter({
    routes: [
        {
            path: '/',
            component: RegComp
        },
        {
            path: '/about',
            component: AboutT
        }
    ]
});

new Vue({
    el: '#app',
    components: {
        NavBarT
    },
    router,
    template: MainT
})