<template>
  <div class="table-page">

    <el-checkbox-group v-model="checkList">
      <el-checkbox label="1">查询</el-checkbox>
      <el-checkbox label="2">经办</el-checkbox>
      <el-checkbox label="3">批准</el-checkbox>
    </el-checkbox-group>

    <div class="checks">
      <el-checkbox @change="checkAll" v-model="checked1">全选所有菜单</el-checkbox>
      <el-checkbox @change="checkNew" v-model="checked2">全选新增菜单</el-checkbox>
      <div>
        <button @click="getKeys">获取选中节点的key</button>
        <span>{{ keys }}</span>
      </div>
    </div>
    <cus-table :default-expanded-keys="defaultExpanded" :default-checked-keys="defaultChecked" ref="table"
      :data="data"></cus-table>
  </div>
</template>


<script setup>
import { ref, watch, computed, nextTick, onMounted } from 'vue'
import CusTable from 'pkg/cus-table'
import treeData from '@/params.js'

const data = ref(treeData.data.menuDTOList)


const checked1 = ref(false)
const checked2 = ref(false)

const checkList = ref(['1', '2'])

const table = ref(null)
const keys = ref([])
const defaultExpanded = ref([])
const defaultChecked = ref([])
const nodesMap = ref({})

onMounted(() => {
  nodesMap.value = table.value.getAllNodesMap()
})


function checkAll(val) {
  table.value.checkAll(val)
}

function checkNew(val) {
  table.value.checkNew(val)
}

function getKeys() {
  keys.value = table.value.getCheckedKeys()
}

function handleType(val) {
  for (let node of Object.values(nodesMap.value)) {
    if (val.includes(node.data.type)) {
      node.setChecked(true, true)
      node.expand(null, true)
    }
  }
}

watch(checkList, (val) => {
  handleType(val)
})


</script>



<style lang="scss" scoped>
.table-page {
  .checks {
    margin-bottom: 10px;
  }
}
</style>
