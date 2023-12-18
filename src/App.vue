<template>
  <div>
    <CusTableItem :data="data"></CusTableItem>
  </div>
</template>


<script setup>
import { reactive } from 'vue'
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


</script>



<style scoped></style>
