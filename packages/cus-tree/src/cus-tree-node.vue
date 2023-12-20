<template>
    <div @click.stop="handleClick" class="cus-tree-node" :style="{ flex: hasChild ? '1 0 100%' : '33%' }">
        <div @click="handleExpandClick" class="cus-node-title"
            :style="{ 'padding-left': index % 3 === 0 ? (node.level - 1) * tree.indent + 'px' : 0 }">
            <el-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate"
                :disabled="!!node.disabled" @click.native.stop @change="handleCheckChange"></el-checkbox>
            <span class="title">{{ data.label }}</span>
            <template v-if="node.childNodes.length > 0">
                <i v-if="expanded" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
            </template>
            <img v-if="data.new" class="new" src="./img/new.png" alt="">
        </div>
        <div class="cus-node-content">
            <collapse-transition>
                <div class="content-container" v-if="childNodeRendered" v-show="expanded">
                    <div>
                        <cus-tree-node :show-checkbox="showCheckbox" :node="child" v-for="(child, index) in node.childNodes"
                            :key="getKey(child)" :index="index"></cus-tree-node>
                    </div>
                </div>
            </collapse-transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'cus-tree-node',
}
</script>

<script setup>
import { ref, computed, onMounted, watch, nextTick, inject, getCurrentInstance } from 'vue';
import { getNodeKey } from './model/utils'
import CollapseTransition from '@/utils/collapse-transition.js'

//注入父级树组件
const tree = inject('tree')
const nodeInstance = ref(getCurrentInstance().proxy);
const props = defineProps({
    node: {
        type: Object
    },
    showCheckbox: {
        type: Boolean,
        default: false
    },
    index: Number
})

const expanded = ref(false)
const childNodeRendered = ref(false)//子节点是否渲染
const oldChecked = ref(null)//上次选中的值
const oldIndeterminate = ref(null)

const data = computed(() => {
    return props.node.data
})

const hasChild = computed(() => {
    return props.node.childNodes.length > 0
})

onMounted(() => {
    // console.log(tree.value)

    if (props.node.expanded) {
        expanded.value = true;
        childNodeRendered.value = true
    }

})


//处理展开事件
function handleExpandClick() {
    if (props.node.isLeaf) return;
    if (expanded.value) {
        tree.value.$emit('node-collapse', props.node.data, props.node, nodeInstance.value);
        props.node.collapse();
    } else {
        props.node.expand();
        tree.value.$emit('node-expand', props.node.data, props.node, nodeInstance.value);
    }
}

//处理点击事件
function handleClick() {
    const store = props.node.store;
    store.setCurrentNode(props.node);
    // tree.value.$emit('current-change', store.currentNode ? store.currentNode.data : null, store.currentNode);
    tree.value.$emit('node-click', props.node.data, props.node, nodeInstance.value);
}

function getKey(node) {
    return getNodeKey(node.store.key, node.data);
}

//处理选中事件
function handleCheckChange(value, ev) {
    props.node.setChecked(ev.target.checked, true);
    nextTick(() => {
        const store = props.node.store;
        tree.value.$emit('check', props.node.data, {
            checkedNodes: store.getCheckedNodes(),
            checkedKeys: store.getCheckedKeys(),
            halfCheckedNodes: store.getHalfCheckedNodes(),
            halfCheckedKeys: store.getHalfCheckedKeys(),
        });
    })
}

function handleSelectChange(checked, indeterminate) {
    if (oldChecked.value !== checked && oldIndeterminate.value !== indeterminate) {
        tree.value.$emit('check-change', props.node.data, checked, indeterminate);
    }
    oldChecked.value = checked;
    oldIndeterminate.value = indeterminate;
}

watch(() => props.node.expanded, (val) => {
    nextTick(() => expanded.value = val);
    if (val) {
        childNodeRendered.value = true;
    }
})

watch(() => props.node.checked, (val) => {
    handleSelectChange(val, props.node.indeterminate);
})

watch(() => props.node.indeterminate, (val) => {
    handleSelectChange(props.node.checked, val);
})
</script>

<style lang="scss" scoped>
.cus-tree-node {
    font-size: 16px;
    flex-basis: 100%;

    .new {
        width: 32px;
        margin-left: 10px;
    }

    .cus-node-title {
        display: flex;
        align-items: center;
        cursor: pointer;
        padding: 15px 0;

        .title {
            margin: 0 10px;
            user-select: none;
        }
    }

    .cus-node-content {
        .content-container {
            &>div {
                display: flex;
                flex-wrap: wrap;

            }
        }
    }

}
</style>