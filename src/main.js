import Vue from 'vue'
import App from './App.vue'
import VueCompositionAPI from '@vue/composition-api'
import { Checkbox, Tree, CheckboxGroup, Popover } from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css';
import './styles/index.scss'

Vue.component(Checkbox.name, Checkbox);
Vue.component(CheckboxGroup.name, CheckboxGroup);
Vue.component(Tree.name, Tree);
Vue.component(Popover.name, Popover);



Vue.config.productionTip = false
Vue.use(VueCompositionAPI)

new Vue({
    el: '#app',
    render: h => h(App)
})
