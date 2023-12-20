<template>
    <div class="cus-table">
        <div @click="expend" class="cus-table-header">
            <el-checkbox v-if="showCheckbox" :indeterminate="isIndeterminate" v-model="checked"></el-checkbox>
            <span class="title">{{ data.title }}</span>
            <i v-if="isExpend" class="el-icon-arrow-down"></i>
            <i v-else class="el-icon-arrow-up"></i>
        </div>
        <div class="cus-table-content">
            <collapse-transition>
                <div class="content-container" v-show="isExpend">
                    <div>
                        <cus-tree ref="tree" :show-checkbox="showCheckbox" @node-collapse="nodeCollapse"
                            @node-expand="nodeExpand" @node-click="nodeClick" @check="check" node-key="id" :data="TreeData"
                            :default-expanded-keys="defaultExpanded" :default-checked-keys="defaultChecked"></cus-tree>
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
import { ref, watch, nextTick, computed, onMounted } from 'vue'
import CollapseTransition from '@/utils/collapse-transition.js'
import CusTree from '../../cus-tree';
const props = defineProps({
    data: {
        type: Object,
        default: () => {
            return {}
        }
    },
    name: {
        type: [String, Number]
    },
    showCheckbox: {
        type: Boolean,
        default: false
    }
})
const $emit = defineEmits(['selected'])
const tree = ref(null)
const checked = ref(true)
const isExpend = ref(true)
const TreeData = ref([{
    id: 1,
    label: '一个理财产品的分类',
    children: [{
        id: 2,
        label: '产品介绍',
        disabled: true,
        checked: true
    }, {
        id: 3,
        label: '签约',
        new: true
    }, {
        id: 4,
        label: '查询',
    }]
}, {
    id: 5,
    label: '第二个分类',
    children: [{
        id: 6,
        label: '第三层级',
        children: [{
            id: 7,
            label: '产品介绍',
        }, {
            id: 8,
            label: '签约',
        }, {
            id: 9,
            label: '查询',
        },
        {
            id: 14,
            label: '单笔转账',
        }]
    }]
}, {
    id: 10,
    label: "账户查询"
},
{
    id: 11,
    label: "交易明细"
},
{
    id: 12,
    label: "银企对账"
},
{
    id: 13,
    label: "限额管理"
}])
const defaultChecked = ref([1, 2, 11])
const defaultExpanded = ref([1, 6])
const isIndeterminate = ref(false)

// const isIndeterminate = computed(() => {
//     return  

// })

onMounted(() => {
    nextTick(() => {
        handleIndeterminate()
    })
})

//判断是否半选
function handleIndeterminate() {
    const count = tree.value.root.store.count;
    const keys = tree.value.root.store.getCheckedKeys();
    isIndeterminate.value = keys.length > 0 && keys.length < count ? true : false
}


//展开
function expend() {
    isExpend.value = !isExpend.value
}

function setAllChecked(val) {
    tree.value.setAllChecked(val)
    let allResult = tree.value.root.store.getCheckedKeys()
    let halfResult = tree.value.root.store.getHalfCheckedKeys()
    $emit('check', {
        checkedKeys: allResult,
        halfCheckedKeys: halfResult
    })
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


watch(checked, (val) => {
    nextTick(() => {
        setAllChecked(val)
        handleIndeterminate()
    })
}, {
    immediate: true
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