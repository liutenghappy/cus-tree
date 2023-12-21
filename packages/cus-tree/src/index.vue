<template>
    <div class="cus-tree">
        <CusTreeNode :line-num="lineNum" :show-checkbox="showCheckbox"></CusTreeNode>
    </div>
</template>

<script>
import { defineComponent, provide, getCurrentInstance, } from '@vue/composition-api'
import CusTreeNode from './cus-tree-node.vue'

export default defineComponent({
    components: {
        CusTreeNode
    },
    props: {
        lineNum: {
            type: Number,
            default: 3
        },
        showCheckbox: {
            type: Boolean,
            default: true
        }
    },
    setup() {
        const tree = getCurrentInstance();
        provide('tree', tree.proxy)
    },
})
</script>

<style lang="scss" scoped>
@import 'sty/mixin.scss';

@include b(tree) {
    font-size: 16px;
    display: flex;
    flex-wrap: wrap;
}
</style>