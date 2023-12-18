<template>
    <div class="cus-table">
        <div @click="expend" class="cus-table-header">
            <el-checkbox v-model="checked"></el-checkbox>
            <span class="title">{{ data.title }}</span>
            <i v-if="isExpend" class="el-icon-arrow-down"></i>
            <i v-else class="el-icon-arrow-up"></i>
        </div>
        <div class="cus-table-content">
            <collapse-transition>
                <div class="content-container" v-show="isExpend">
                    <div>
                        <cus-tree :data="TreeData"></cus-tree>
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
import { ref } from 'vue'
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
    }
})
const checked = ref(true)
const isExpend = ref(true)
const TreeData = ref([{
    id: 1,
    label: '一个理财产品的分类',
    children: [{
        id: 2,
        label: '产品介绍',
    }, {
        id: 3,
        label: '签约',
    }, {
        id: 4,
        label: '查询',
    }]
}, {
    id: 2,
    label: '第二个分类',
    children: [{
        id: 5,
        label: '第三层级',
        children: [{
            id: 2,
            label: '产品介绍',
        }, {
            id: 3,
            label: '签约',
        }, {
            id: 4,
            label: '查询',
        }]
    }]
}])

function expend() {
    isExpend.value = !isExpend.value
}

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