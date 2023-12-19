<template>
    <div class="cus-tree-node" :style="{ flex: hasChild ? '1 0 100%' : '33%' }">
        <div @click="handleExpandIconClick" class="cus-node-title"
            :style="{ 'padding-left': index === 0 ? (node.level - 1) * 24 + 'px' : 0 }">
            <el-checkbox v-model="node.checked" :indeterminate="node.indeterminate" :disabled="!!node.disabled"
                @click.native.stop @change="handleCheckChange"></el-checkbox>
            <span class="title">{{ data.label }}</span>
            <template v-if="node.childNodes.length > 0">
                <i v-if="expanded" class="el-icon-arrow-down"></i>
                <i v-else class="el-icon-arrow-up"></i>
            </template>
        </div>
        <div class="cus-node-content">
            <collapse-transition>
                <div class="content-container" v-if="childNodeRendered" v-show="expanded">
                    <div>
                        <cus-tree-node :node="child" v-for="(child, index) in node.childNodes" :key="getKey(child)"
                            :index="index"></cus-tree-node>
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
import { ref, computed, onMounted, watch, nextTick, inject } from 'vue';
import { getNodeKey } from './model/utils'
import CollapseTransition from '@/utils/collapse-transition.js'

const tree = inject('tree')
const props = defineProps({
    node: {
        type: Object
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
    console.log(tree.value)

    if (props.node.expanded) {
        expanded.value = true;
        childNodeRendered.value = true
    }

})



function handleExpandIconClick() {
    if (expanded.value) {
        // this.tree.$emit('node-collapse', this.node.data, this.node, this);
        props.node.collapse();
    } else {
        props.node.expand();
        // this.$emit('node-expand', this.node.data, this.node, this);
    }
}

function getKey(node) {
    return getNodeKey(node.store.key, node.data);
}

function handleCheckChange(value, ev) {
    props.node.setChecked(ev.target.checked, true);
    // this.$nextTick(() => {
    //     const store = this.tree.store;
    //     this.tree.$emit('check', this.node.data, {
    //         checkedNodes: store.getCheckedNodes(),
    //         checkedKeys: store.getCheckedKeys(),
    //         halfCheckedNodes: store.getHalfCheckedNodes(),
    //         halfCheckedKeys: store.getHalfCheckedKeys(),
    //     });
    // });
}

function handleSelectChange(checked, indeterminate) {
    if (oldChecked.value !== checked && oldIndeterminate.value !== indeterminate) {
        // this.tree.$emit('check-change', this.node.data, checked, indeterminate);
    }
    oldChecked.value = checked;
    indeterminate.value = indeterminate;
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

            }
        }
    }

}
</style>