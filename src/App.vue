<template>
  <div>
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="Q">查询</el-checkbox>
      <el-checkbox label="O">经办</el-checkbox>
      <el-checkbox label="R">批准</el-checkbox>
    </el-checkbox-group>

    <div class="checks">
      <el-checkbox @change="checkAll" v-model="checked1">全选所有菜单</el-checkbox>
      <el-checkbox @change="checkNew" v-model="checked2">全选新增菜单</el-checkbox>
      <el-checkbox @change="setExpandedAll" v-model="expand">全展开</el-checkbox>
      <el-checkbox v-model="readOnly">只读</el-checkbox>
      <div>
        <button @click="getKeys">获取选中节点的key</button>
        <span>{{ keys }}</span>
      </div>
    </div>
    <cus-tree ref="tree" :readOnly="readOnly" :defaultExpandedKeys="defaultExpanded" :defaultCheckedKeys="defaultChecked"
      node-key="id" :data="data" :props="props" :show-checkbox="showCheckbox" :line-num="lineNum">
      <template #default="{ node }">
        <span>{{ node.label }}</span>
        <i class="new" v-if="node.data.new">NEW</i>
      </template>
    </cus-tree>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from '@vue/composition-api'
import CusTree from 'pkg/cus-tree'
import treeData from '@/params.js'

export default defineComponent({
  components: {
    'cus-tree': CusTree
  },
  setup() {
    const showCheckbox = ref(true)
    const lineNum = ref(4)
    const data = ref(treeData.data.menuDTOList)
    const defaultExpanded = ref([])
    const defaultChecked = ref([])
    const props = ref({
      label: 'name',
      children: 'childList'
    })
    const tree = ref(null)
    const checkList = ref([])
    const checked1 = ref(false)
    const checked2 = ref(false)
    const keys = ref([])
    const expand = ref(false)
    const readOnly = ref(false)

    function checkAll(val) {
      tree.value.setAll(val)
    }

    function checkNew(val) {
      const nodes = tree.value.getAllNodes()
      const result = nodes.filter(n => {
        return n.data.new
      }).map(n => n.key);
      tree.value.setKeys(result, val)
    }

    function getKeys() {
      keys.value = tree.value.getCheckedKeys()
    }

    function setExpandedAll(val) {
      tree.value.setExpandedAll(val)
    }

    //查询/经办/批准
    function setType(val) {
      const nodes = tree.value.getAllNodes()
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        const v = val.includes(node.data.type)

        if (v) {
          node.expand(null, true);
        } else {
          node.collapse(null);
        }
        node.setChecked(v, true)

      }
    }



    watch(checkList, (val) => {
      setType(val)
    })

    return {
      defaultChecked,
      defaultExpanded,
      showCheckbox,
      lineNum,
      data,
      props,
      checkList,
      checked1,
      checked2,
      tree,
      keys,
      expand,
      checkAll,
      checkNew,
      getKeys,
      setExpandedAll,
      readOnly,
    }
  }

})
</script>

<style lang="scss" scoped>
.new {
  font-size: 12px;
  font-style: normal;
  color: #ed3c2f;
  border: 1px solid #ed3c2f;
  margin-left: 10px;
  padding: 0 2px;
}
</style>