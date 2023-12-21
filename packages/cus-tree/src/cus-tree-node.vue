<template>
    <div :class="{ 'cus-tree-node': true, 'oneLevel': true }">
        <div @click="handleExpandClick" class="cus-node-title">
            <!-- <el-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate"
                :disabled="!!node.disabled" @click.native.stop @change="handleCheckChange"></el-checkbox> -->
            <i :class="{ 'icon': true, 'el-icon-caret-right': true, 'expanded': expanded }"></i>
            <el-checkbox v-if="showCheckbox" @click.native.stop></el-checkbox>
            <span class="title">父节点</span>
        </div>
        <div class="cus-node-content">
            <collapse-transition>
                <div class="content-container" v-show="expanded">
                    <div>
                        子节的
                        <!-- <cus-tree-node :line-num="lineNum" :show-checkbox="showCheckbox" :node="child"
                            v-for="(child, index) in node.childNodes" :key="getKey(child)" :index="index"></cus-tree-node> -->
                    </div>
                </div>
            </collapse-transition>
        </div>
    </div>
</template>

<script>
import { defineComponent } from '@vue/composition-api'
import CollapseTransition from '@/utils/collapse-transition.js'
import { useTreeNodeCom } from './tree-node.js'
export default defineComponent({
    inject: ['tree'],
    components: {
        CollapseTransition
    },
    props: {
        lineNum: {
            type: Number,
            default: 3
        },
        showCheckbox: {
            type: Boolean,
            default: true
        }
    },
    setup(props) {

        return {
            ...useTreeNodeCom(props)
        }
    }
})
</script>

<style lang="scss" scoped>
@import 'sty/mixin.scss';

@include b(tree) {
    font-size: 16px;
    flex-basis: 100%;

    .new {
        width: 30px;
        margin-left: 7px;
    }

    .cus-node-title {
        height: 40px;
        display: flex;
        align-items: center;
        cursor: pointer;
        user-select: none;

        .icon {
            color: #868686;
            margin-right: 10px;
            transition: transform .2s linear;

            &.expanded {
                transform: rotate(90deg);
            }
        }

        .title {
            margin: 0 10px;
            user-select: none;
        }
    }

    .cus-node-content {
        .content-container {
            &>div {
                display: flex;
                flex-wrap: wrap;

            }
        }
    }
}
</style>