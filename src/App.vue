<template>
  <div>
    <CusTableItem  :show-checkbox="showCheckbox" @check="check" :data="data"></CusTableItem>
  </div>
</template>


<script setup>
import { reactive, ref } from 'vue'
import CusTableItem from '../packages/cus-table-item';

const data = reactive({
  title: '理财',
  children: [
    {
      id: '1',
      label: '产品介绍',
      new: false,
      disabled: true
    },
    {
      id: '2',
      label: '签约',
      new: false,
      disabled: false
    },
    {
      id: '3',
      label: '查询',
      new: true,
      disabled: false
    }
  ]
})
const showCheckbox = ref(true)

function check(obj) {
  console.log(obj)
}


</script>



<style scoped></style>
