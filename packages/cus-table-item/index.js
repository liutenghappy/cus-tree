import CusTable from './src/index.vue'

CusTable.install = function (Vue) {
    Vue.component(CusTable.name, CusTable);
}

export default CusTable