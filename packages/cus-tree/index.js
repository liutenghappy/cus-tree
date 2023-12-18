import CusTree from './src/index.vue'

CusTree.install = function (Vue) {
    Vue.component(CusTree.name, CusTree);
}

export default CusTree