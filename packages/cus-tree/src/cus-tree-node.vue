<template>
    <div class="cus-tree-node">
        <div @click="expend" class="cus-node-title"
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
                <div class="content-container" v-show="expanded">
                    <div>
                        <cus-tree-node :node="child" v-for="(child,index) in node.childNodes" :key="getKey(child)" :index="index"></cus-tree-node>
                    </div>
                </div>
            </collapse-transition>
        </div>
    </div>
</template>

<script>
export default {
    name: 'cus-tree-node'
}
</script>

<script setup>
import CollapseTransition from '@/utils/collapse-transition.js'
import { ref, computed, onMounted } from 'vue';
import { getNodeKey } from './model/node'

const props = defineProps({
    node: {
        type: Object
    },
    index: Number
})

const expanded = ref(false)
const tree = ref(null)

const data = computed(() => {
    return props.node.data
})

onMounted(() => {
    console.log(props.node)

    if (props.node.expanded) {
        expanded.value = true;
    }

})

function expend() {
    expanded.value = !expanded.value
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