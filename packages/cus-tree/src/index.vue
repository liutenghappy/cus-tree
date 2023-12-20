<template>
    <div class="cus-tree">
        <cus-tree-node :show-checkbox="showCheckbox" v-for="(child, index) of root?.childNodes" :node="child" :index="index"
            :key="child[nodeKey]"></cus-tree-node>
    </div>
</template>

<script>
export default {
    name: "cus-tree",
}
</script>

<script setup>
import { ref, onMounted, watch, getCurrentInstance, provide } from 'vue'
import TreeStore from './model/tree-store'
import cusTreeNode from './cus-tree-node.vue';
const tree = getCurrentInstance();
provide('tree', ref(tree.proxy))
const props = defineProps({
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
    //子节点的缩进
    indent: {
        type: Number,
        default: 24
    },
    //是否可选
    showCheckbox: {
        type: Boolean,
        default: false
    },
})

const store = ref({})
const root = ref(null)

onMounted(() => {
    store.value = new TreeStore({
        key: props.nodeKey,
        data: props.data,
        props: props.props,
        currentNodeKey: props.currentNodeKey,
        defaultCheckedKeys: props.defaultCheckedKeys,
        defaultExpandedKeys: props.defaultExpandedKeys,
        autoExpandParent: props.autoExpandParent,
        defaultExpandAll: props.defaultExpandAll,
    });
    root.value = store.value.root;
})

//全选
function setAllChecked(checked) {
    root.value.childNodes.forEach((child) => {
        child.setChecked(checked, true)
    })
}


watch(() => props.data, (newVal) => {
    store.value.setData(newVal);
})

watch(() => props.defaultCheckedKeys, (newVal) => {
    store.value.setDefaultCheckedKey(newVal);
})

watch(() => props.defaultExpandedKeys, (newVal) => {
    store.value.defaultExpandedKeys = newVal;
    store.value.setDefaultExpandedKeys(newVal);
})

//暴露setup内的方法和属性
defineExpose({
    root,
    setAllChecked
})

</script>


<style lang="scss" scoped>
.cus-tree {
    font-size: 16px;
    display: flex;
    flex-wrap: wrap;
}
</style>