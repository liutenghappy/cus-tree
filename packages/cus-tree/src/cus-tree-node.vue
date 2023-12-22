<template>
    <div :class="{
        'cus-tree-node': true,
        'oneLevel': node.level === 1,
        'childLevel': node.level !== 1 && !node.isLeaf,
        'isLeaf': node.isLeaf,
        'boderBottom': expanded
    }" :style="leafStyle">
        <div @click="handleExpandClick" :class="{ 'cus-node-title': true, 'boderBottom': expanded }" :style="indentStyle">
            <i v-if="!node.isLeaf" :class="{ 'icon': true, 'el-icon-caret-right': true, 'expanded': expanded }"></i>
            <i class="bot" v-else></i>
            <el-checkbox v-if="showCheckbox" v-model="node.checked" :indeterminate="node.indeterminate"
                @change="handleCheckChange" :disabled="!!node.disabled" @click.native.stop></el-checkbox>
            <span @click="handleClick" class="title">{{ node.label }}</span>
        </div>
        <div class="cus-node-content">
            <collapse-transition>
                <div class="content-container" v-show="expanded">
                    <div>
                        <cus-tree-node :line-num="lineNum" :show-checkbox="showCheckbox" :node="child"
                            v-for="(child, index) in node.childNodes" :key="getKey(child)" :index="index"></cus-tree-node>
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
    name: 'cus-tree-node',
    components: {
        CollapseTransition
    },
    props: {
        node: {
            type: Object
        },
        index: Number,
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
$borderColor: #e5e6eb;
$bgColor: #f7f8fa;
$fontColor: #1d2129;
$leafColor: #415969;
$newColor: #ed3c2f;

.boderBottom {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-color: $borderColor;
}


@include b('tree-node') {
    flex-basis: 100%;
    color: $leafColor;
    box-sizing: border-box;



    &.oneLevel {
        color: $fontColor ;
        @extend .boderBottom;
        // border-bottom: 1px solid $borderColor;

        &>.cus-node-title {
            cursor: pointer;
            font-weight: 600;
        }

        &:last-of-type {
            border-bottom: none
        }
    }

    &.childLevel {
        &>.cus-node-title {
            @extend .boderBottom
        }
    }

    &.isLeaf {}

    .cus-node-title {
        height: 40px;
        display: flex;
        align-items: center;
        user-select: none;
        border-bottom: 1px solid transparent;
        transition: border-bottom-color .3s linear;

        .bot {
            width: 34px
        }

        &.boderBottom {
            @extend .boderBottom;
        }

        .icon {
            color: #868686;
            margin: 0 10px;
            transition: transform .2s linear;

            &.expanded {
                transform: rotate(90deg);
            }
        }

        .title {
            margin: 0 10px;
            user-select: none;
            cursor: pointer;
        }
    }

    .cus-node-content {
        .content-container {
            will-change: height;

            &>div {
                display: flex;
                flex-wrap: wrap;
                padding: 10px 0;
                background: $bgColor;
            }
        }
    }
}
</style>