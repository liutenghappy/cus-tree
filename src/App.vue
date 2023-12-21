<template>
  <div class="table-page">
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
import { ref } from 'vue'
import CusTable from 'pkg/cus-table'
import treeData from '@/params.js'

const data = ref(treeData.data.menuDTOList)

const checked1 = ref(false)
const checked2 = ref(false)

const table = ref(null)
const keys = ref([])
const defaultExpanded = ref(['2', '16', '3'])
const defaultChecked = ref(['3','2','3-5'])





function checkAll(val) {
  table.value.checkAll(val)
}

function checkNew(val) {
  table.value.checkNew(val)
}

function getKeys() {
  keys.value = table.value.getCheckedKeys()
}


</script>



<style lang="scss" scoped>
.table-page {
  .checks {
    margin-bottom: 10px;
  }
}
</style>
