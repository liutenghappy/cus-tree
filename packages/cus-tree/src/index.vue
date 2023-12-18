<template>
    <div class="cus-tree">
        <cus-tree-node v-for="(child, index) of root?.childNodes" :node="child" :index="index"
            :key="child[nodeKey]"></cus-tree-node>
    </div>
</template>

<script>
export default {
    name: "cus-tree"
}
</script>

<script setup>
import { ref, onMounted, watch, provide } from 'vue'
import TreeStore from './model/tree-store'
import cusTreeNode from './cus-tree-node.vue';
const props = defineProps({
    data: {
        type: Array,
        default: () => []
    },
    nodeKey: String,//每个树节点用来作为唯一标识的属性，整棵树应该是唯一的
    currentNodeKey: [String, Number],//当前选中的节点
    defaultCheckedKeys: Array,//默认勾选的节点的 key 的数组
    defaultExpandedKeys: Array,//默认展开的节点的 key 的数组
    autoExpandParent: {//展开子节点的时候是否自动展开父节点
        type: Boolean,
        default: true
    },
    defaultExpandAll: Boolean,//是否默认展开所有节点
})

const store = ref({})
const root = ref(null)

onMounted(() => {
    store.value = new TreeStore({
        key: props.nodeKey,
        data: props.data,
        currentNodeKey: props.currentNodeKey,
        defaultCheckedKeys: props.defaultCheckedKeys,
        defaultExpandedKeys: props.defaultExpandedKeys,
        autoExpandParent: props.autoExpandParent,
        defaultExpandAll: props.defaultExpandAll,
    });

    root.value = store.value.root;
})

watch(() => props.data, () => {
    store.value.setData(newVal);
})



</script>


<style lang="scss" scoped>
.cus-tree {
    font-size: 16px;
}
</style>