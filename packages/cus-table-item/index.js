import CusTableItem from './src/index.vue'

CusTableItem.install = function (Vue) {
    Vue.component(CusTableItem.name, CusTableItem);
}

export default CusTableItem