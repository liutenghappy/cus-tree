<template>
  <div>
    <CusTree :show-checkbox="showCheckbox" :line-num="lineNum"></CusTree>
  </div>
</template>

<script>
import { defineComponent,ref } from '@vue/composition-api'
import CusTree from 'pkg/cus-tree'

export default defineComponent({
  components: {
    CusTree
  },
  setup(){
    const showCheckbox = ref(true)
    const lineNum = ref(3)

    return {
      showCheckbox,
      lineNum
    }
  }

})
</script>

<style></style>