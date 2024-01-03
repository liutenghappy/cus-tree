<template>
  <div>
    <el-checkbox-group v-model="checkList">
      <el-checkbox label="Q">查询</el-checkbox>
      <el-checkbox label="O">经办</el-checkbox>
      <el-checkbox label="R">批准</el-checkbox>
    </el-checkbox-group>

    <div class="checks">
      <el-checkbox @change="checkNew" v-model="checked2">全选新增菜单</el-checkbox>
      <el-checkbox @change="checkAll" v-model="checked1">全选</el-checkbox>
      <el-checkbox v-model="readOnly">只读</el-checkbox>
      <div>
        <button @click="getKeys">获取选中节点的key</button>
        <span>{{ keys }}</span>
      </div>
    </div>
    <cus-tree ref="tree" node-key="id" :data="data" :readOnly="readOnly">
      <template #default="{ node }">
        <template v-if="node.data.disabled">
          <el-popover placement="top" title="" width="150" trigger="hover" content="该菜单权限已被禁止">
            <span slot="reference">{{ node.label }}</span>
            <i class="new" v-if="node.data.new">NEW</i>
          </el-popover>
        </template>

        <template v-else>
          <span>{{ node.label }}</span>
          <i class="new" v-if="node.data.new">NEW</i>
        </template>
      </template>
    </cus-tree>
  </div>
</template>

<script>
import { defineComponent, ref, watch } from '@vue/composition-api'
import CusTree from 'pkg/simple-tree/tree.vue'
import treeData from '@/params.js'

export default defineComponent({
  components: {
    'cus-tree': CusTree
  },
  setup() {
    const data = ref(treeData.data.menuDTOList)
    const tree = ref(null)
    const checkList = ref([])
    const checked1 = ref(false)
    const checked2 = ref(false)
    const keys = ref([])
    const readOnly = ref(false)

    function checkNew(val) {
      console.log(val)
      const nodes = tree.value.getAllNodes()
      nodes.filter(n => {
        return n.data.new
      }).map(n => {
        n.setChecked(val)
        if (val) {
          n.expand()
        } else {
          n.parentNode.collapse()
        }
      });
    }

    function getKeys() {
      keys.value = tree.value.getCheckedKeys()
    }

    //查询/经办/批准
    function setType(val) {
      const nodes = tree.value.getAllNodes()
      for (let i = 0; i < nodes.length; i++) {
        const node = nodes[i]
        let types = typeof node.data.type === 'string' ?
          [node.data.type] : Array.isArray(node.data.type) ?
            node.data.type : [];
        const v = types.some(t => val.includes(t))
        if (v) {
          node.expand();
        } else {
          node.collapse();
        }
        node.setChecked(v)
      }
    }


    function checkAll(val) {
      const nodes = tree.value.getAllNodes().sort((a, b) => b.id - a.id);
      nodes.forEach(node => {
        node.setChecked(val)
        if (val) {
          window.requestAnimationFrame(() => {
            node.expanded = true
          })
        } else {
          node.collapse();
        }
      });
    }

    watch(checkList, (val) => {
      setType(val)
    })

    return {
      readOnly,
      data,
      checkList,
      checked1,
      checked2,
      tree,
      keys,
      checkNew,
      getKeys,
      checkAll
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