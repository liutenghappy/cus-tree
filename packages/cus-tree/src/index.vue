<template>
    <div class="cus-tree">
        <cus-tree-node :line-num="lineNum" :readOnly="readOnly" :show-checkbox="!readOnly"
            v-for="(child, index) of root?.childNodes" :node="child" :index="index" :key="child[nodeKey]">
        </cus-tree-node>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import { useTreeWrap } from './tree.js'
import CusTreeNode from './cus-tree-node.vue'
export default defineComponent({
    name: 'cus-tree',
    components: {
        'cus-tree-node': CusTreeNode
    },
    props: {
        data: {
            type: Array,
            default: () => []
        },
        //每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
        nodeKey: String,
        //当前选中的节点
        currentNodeKey: [String, Number],
        //默认勾选的节点的 key 的数组
        defaultCheckedKeys: Array,
        //默认展开的节点的 key 的数组
        defaultExpandedKeys: Array,
        //展开子节点的时候是否自动展开父节点
        autoExpandParent: {
            type: Boolean,
            default: true
        },
        //是否默认展开所有节点
        defaultExpandAll: Boolean,
        props: {
            default() {
                return {
                    children: 'children',
                    label: 'label',
                    disabled: 'disabled'
                };
            }
        },
        //叶子节点横排数
        lineNum: {
            type: Number,
            default: 3
        },
        //子节点的缩进
        indent: {
            type: Number,
            default: 24
        },
        //只读
        readOnly: {
            type: Boolean,
            default: false
        }
    },
    setup(props) {
        return {
            ...useTreeWrap(props)
        }

    },
})
</script>

<style lang="scss" scoped>
@import 'sty/mixin.scss';
$borderColor: #e5e6eb;

@include b(tree) {
    font-size: 14px;
    display: flex;
    flex-wrap: wrap;
    border: 1px solid $borderColor;
}
</style>