<template>
  <div>
    <cus-tree :data="data" :props="props" :show-checkbox="showCheckbox" :line-num="lineNum"></cus-tree>
  </div>
</template>

<script>
import { defineComponent, ref } from '@vue/composition-api'
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
    console.log(data.value)
    const props = ref({
      label: 'name',
      children: 'childList'
    })

    return {
      showCheckbox,
      lineNum,
      data,
      props
    }
  }

})
</script>

<style></style>