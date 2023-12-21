<template>
    <div class="cus-tree">
        <cus-tree-node :line-num="lineNum" :show-checkbox="showCheckbox" v-for="(child, index) of root?.childNodes"
            :node="child" :index="index" :key="child[nodeKey]"></cus-tree-node>
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
    //叶子节点横排数
    lineNum: {
        type: Number,
        default: 3
    }
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

//获取选中节点的key
function getCheckedKeys(leafOnly = false) {
    return store.value.getCheckedKeys(leafOnly)
}

//获取选中的节点
function getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
    return store.value.getCheckedNodes(leafOnly, includeHalfChecked)
}

//获取半选中节点
function getHalfCheckedNodes() {
    return store.value.getHalfCheckedNodes()
}

//获取半选中节点的key
function getHalfCheckedKeys() {
    return store.value.getHalfCheckedKeys()
}



//选中或取消新增节点
function setNewChecked(val) {
    if (!props.nodeKey) throw new Error('[Tree] nodeKey 是必须的');
    const keys = store.value.newNodes.map(node => {
        return node.data[props.nodeKey]
    })
    setCheckedKeys(keys, val)
}

//设置选中的节点（根据传入的key）
function setCheckedKeys(keys, value = true, leafOnly = false) {
    if (!props.nodeKey) throw new Error('[Tree] nodeKey 是必须的');
    store.value.setCheckedKeys(keys, value, leafOnly);
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
    store,
    setAllChecked,
    getCheckedKeys,
    getCheckedNodes,
    getHalfCheckedNodes,
    getHalfCheckedKeys,
    setNewChecked,
    setCheckedKeys
})

</script>


<style lang="scss" scoped>
.cus-tree {
    font-size: 16px;
    display: flex;
    flex-wrap: wrap;
}
</style>