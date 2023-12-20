<template>
    <div class="cus-table">
        <CusTableItem ref="tableItems" :default-expanded-keys="defaultExpandedKeys"
            :default-checked-keys="defaultCheckedKeys" v-for="item of data" :key="item.id" :show-checkbox="true"
            @check="check" :data="item">
        </CusTableItem>
    </div>
</template>

<script>
export default {
    name: "cus-table"
}
</script>

<script setup>
import { ref } from 'vue'
import CusTableItem from 'pkg/cus-table-item'


const props = defineProps({
    data: {
        typpe: Array,
        default: () => []
    },
    //默认勾选的节点的 key 的数组
    defaultCheckedKeys: Array,
    //默认展开的节点的 key 的数组
    defaultExpandedKeys: Array,
})

const tableItems = ref(null)

function check() {

}

//选择所有,传true选所有，传false取消所有
function checkAll(val) {
    tableItems.value.forEach(item => {
        item.checked = val
    });
}

//获取选中节点的key
function getCheckedKeys() {
    const result = []
    tableItems.value.forEach(item => {
        result.push(...item.getCheckedKeys())
    })
    return result
}

//获取选中的节点
function getCheckedNodes() {
    const result = []
    tableItems.value.forEach(item => {
        result.push(...item.getCheckedNodes())
    })
    return result
}

//选择新增节点
function checkNew(val) {
    tableItems.value.forEach(item => {
        item.checkNew(val)
    });
}

defineExpose({
    checkAll,
    checkNew,
    getCheckedKeys,
    getCheckedNodes
})

</script>

<style lang="scss" scoped>
.cus-table {
    &>div {
        margin-bottom: 20px;
    }
}
</style>