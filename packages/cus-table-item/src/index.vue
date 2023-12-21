<template>
    <div class="cus-table">
        <div @click="expend" class="cus-table-header">
            <el-checkbox v-if="showCheckbox" :indeterminate="isIndeterminate" v-model="checked"></el-checkbox>
            <span class="title">{{ data.name }}</span>
            <i v-if="isExpend" class="el-icon-arrow-down"></i>
            <i v-else class="el-icon-arrow-up"></i>
        </div>
        <div class="cus-table-content">
            <collapse-transition>
                <div class="content-container" v-show="isExpend">
                    <div>
                        <cus-tree :props="types" ref="tree" :show-checkbox="showCheckbox" @node-collapse="nodeCollapse"
                            @node-expand="nodeExpand" @node-click="nodeClick" @check="check" node-key="id"
                            :data="data.childList" :default-expanded-keys="defaultExpandedKeys"
                            :default-checked-keys="defaultCheckedKeys"></cus-tree>
                    </div>
                </div>
            </collapse-transition>
        </div>
    </div>
</template>

<script >
export default {
    name: 'cus-table-item'
}
</script>

<script  setup>
import { ref, watch, nextTick, onMounted } from 'vue'
import CollapseTransition from '@/utils/collapse-transition.js'
import CusTree from '../../cus-tree';
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    },
    showCheckbox: {
        type: Boolean,
        default: false
    },
    //默认勾选的节点的 key 的数组
    defaultCheckedKeys: Array,
    //默认展开的节点的 key 的数组
    defaultExpandedKeys: Array,
})
const $emit = defineEmits(['check'])
const tree = ref(null)
const checked = ref(false)
const isExpend = ref(false)
const isIndeterminate = ref(false)
const childCount = ref(props.data?.childList.length || 0)
const rendered = ref(false)
const types = ref({
    label: 'name',
    children: 'childList'
})



onMounted(() => {
    nextTick(() => {
        handleDefaultExpend()
        handleDefaultChecked()
    })
})

//判断是否半选
function handleIndeterminate() {
    const count = tree.value.store.count;
    const keys = tree.value.store.getCheckedKeys();
    if (count === keys.length) checked.value = true;
    if (keys.length === 0) checked.value = false;
    isIndeterminate.value = keys.length > 0 && keys.length < count ? true : false;
}


//展开
function expend() {
    isExpend.value = !isExpend.value
}

function checkAll(val) {
    tree.value.setAllChecked(val)
}
//选择新增节点
function checkNew(val) {
    if (props.data.new) {
        checked.value = true
    } else {
        tree.value.setNewChecked(val)
    }
}

function setAllChecked(val) {
    checkAll(val)
    let allResult = getCheckedKeys()
    let halfResult = getHalfCheckedKeys()
    $emit('check', {
        checkedKeys: allResult,
        halfCheckedKeys: halfResult
    })
}

//获取选中节点的key
function getCheckedKeys(leafOnly = false) {
    const result = tree.value.getCheckedKeys(leafOnly);
    const k = tree.value.store.key;
    if (childCount.value === result.length) {
        result.unshift(props.data[k])
    }
    return result
}

//获取选中的节点
function getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
    return tree.value.getCheckedNodes(leafOnly, includeHalfChecked)
}

//获取半选中节点的key
function getHalfCheckedKeys() {
    return tree.value.getHalfCheckedKeys()
}

//获取半选中节点
function getHalfCheckedNodes() {
    return store.value.getHalfCheckedNodes()
}



//选中事件
function check(data, state) {
    $emit('check', {
        checkedKeys: state.checkedKeys,
        halfCheckedKeys: state.halfCheckedKeys
    })
    handleIndeterminate()
}
//点击事件
function nodeClick(data, node) {
    console.log('点击事件', data, node)
}

//节点展开事件
function nodeExpand(data, node, instance) {
    console.log('节点展开事件', data, node, instance)
}
//节点折叠事件
function nodeCollapse(data, node, instance) {
    console.log('节点折叠事件', data, node, instance)
}

//处理默认展开
function handleDefaultExpend() {
    const key = tree.value.store.key;
    const keyVal = props.data[key];
    if (props.defaultExpandedKeys.includes(keyVal)) {
        isExpend.value = true
    }
}
//默认选中
function handleDefaultChecked() {
    const key = tree.value.store.key;
    const keyVal = props.data[key];
    if (props.defaultCheckedKeys.includes(keyVal)) {
        checked.value = true
    } else {
        handleIndeterminate()
    }

}


watch(checked, (val) => {
    nextTick(() => {
        setAllChecked(val)
        handleIndeterminate()
    })
})

watch(isExpend, (val) => {
    if (val) {
        rendered.value = true
    }
})

watch(() => props.defaultExpandedKeys, () => {
    handleDefaultExpend()
})

watch(() => props.defaultCheckedKeys, () => {
    handleDefaultChecked()
})

defineExpose({
    checked,
    checkNew,
    getCheckedKeys,
    getCheckedNodes,
    getHalfCheckedNodes,
    getHalfCheckedKeys
})


</script>

<style lang="scss" scoped>
.cus-table {
    font-size: 16px;
    border: 1px solid #ebecf0;
    box-sizing: border-box;

    .cus-table-header {
        height: 48px;
        line-height: 48px;
        padding-left: 15px;
        display: flex;
        align-items: center;
        background-color: #f0f1f3;
        cursor: pointer;
        box-sizing: border-box;
        user-select: none;

        .title {
            margin: 0 10px;
            font-weight: bold;
        }
    }

    .cus-table-content {

        .content-container {
            // padding: 20px 15px;
            box-sizing: border-box;
            will-change: height;

            &>div {
                padding: 20px 15px;
            }
        }
    }
}
</style>