import Vue from 'vue'
import App from './App.vue'
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import './assets/global.css';
import axios from "axios";
import VueRouter from 'vue-router';
import router from "@/router";
import store from './store';
import lang from 'element-ui/lib/locale/lang/ja'
import locale from 'element-ui/lib/locale'

locale.use(lang)
// 要导入的包的定义文件 ⭐⭐⭐⭐⭐
Vue.prototype.$axios = axios;
// Vue.prototype.$httpUrl = 'http://localhost:8091'
// Vue.prototype.$httpUrl = 'http://192.168.10.119:8091'
// Vue.prototype.$httpUrl = 'http://192.168.10.17:8091'
Vue.prototype.$httpUrl = 'https://113.40.33.42:8091'
Vue.config.productionTip = false
// Vue.use(ElementUI);
Vue.use(VueRouter);
Vue.use(ElementUI, {size: 'small'})

new Vue({
    router,
    store,
    render: h => h(App),
}).$mount('#app')
