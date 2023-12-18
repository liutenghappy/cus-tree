import Vue from 'vue'
import App from './App.vue'
import { Checkbox, Tree } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './index.scss'

Vue.component(Checkbox.name, Checkbox);
Vue.component(Tree.name, Tree);


Vue.config.productionTip = false

new Vue({
    el: '#app',
    render: h => h(App)
})
