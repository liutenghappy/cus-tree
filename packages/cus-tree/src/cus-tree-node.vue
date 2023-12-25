<template>
    <div :class="{
        'cus-tree-node': true,
        'one-level': node.level === 1,
        'child-level': node.level !== 1 && !node.isLeaf,
        'is-leaf': node.isLeaf,
        [`level-${node.level}`]: true,
        'is-expand': expanded,
        'read-only': readOnly
    }" :style="[leafStyle]">
        <div @click="handleExpandClick" class="cus-node-title" :style="[indentStyle]">
            <i v-if="(!readOnly && !node.isLeaf) || (readOnly && node.level === 1)"
                :class="{ 'icon': true, 'el-icon-caret-right': true, 'expanded': expanded }"></i>
            <i class="bot" v-else></i>
            <el-checkbox v-if="showCheckbox" v-model="checked" :indeterminate="node.indeterminate"
                @change="handleCheckChange" :disabled="!!node.disabled" @click.native.stop></el-checkbox>
            <div @click="handleClick" :class="{ 'title': true, 'disabled': node.disabled }">
                <node-content :node="node"></node-content>
            </div>
        </div>
        <div class="cus-node-content">
            <collapse-transition>
                <div class="content-container" v-if="childNodeRendered" v-show="expanded">
                    <div>
                        <cus-tree-node :readOnly="readOnly" :line-num="lineNum" :show-checkbox="showCheckbox" :node="child"
                            v-for="(child, index) in node.childNodes" :key="getKey(child)" :index="index">
                        </cus-tree-node>
                    </div>
                </div>
            </collapse-transition>
        </div>
    </div>
</template>

<script>
import { defineComponent } from "@vue/composition-api";
import CollapseTransition from "@/utils/collapse-transition.js";
import { useTreeNodeCom, nodeContent } from "./tree-node.js";

export default defineComponent({
    name: "cus-tree-node",
    components: {
        CollapseTransition,
        nodeContent
    },
    props: {
        node: {
            type: Object,
        },
        index: Number,
        lineNum: {
            type: Number,
            default: 3,
        },
        showCheckbox: {
            type: Boolean,
            default: true,
        },
        readOnly: {
            type: Boolean,
            default: false,
        }
    },
    setup(props) {
        return {
            ...useTreeNodeCom(props),
        };
    },
});
</script>

<style lang="scss" scoped>
@import "sty/mixin.scss";
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

@include b("tree-node") {
    flex-basis: 100%;
    color: $leafColor;
    box-sizing: border-box;

    &.one-level {
        color: $fontColor;
        @extend .boderBottom;

        &>.cus-node-title {
            cursor: pointer;
            font-weight: 600;
        }

        &:last-of-type {
            border-bottom: none;
        }

        &.is-expand {
            &>.cus-node-title {
                @extend .boderBottom;
            }
        }
    }

    &.child-level {
        cursor: pointer;

        &>.cus-node-title {
            @extend .boderBottom;
        }
    }

    &.is-leaf {
        &>.cus-node-title {
            height: 60px;
        }

        cursor: auto;
    }

    &.read-only {
        &:not(.one-level) {
            cursor: auto;

            .title {
                cursor: auto;
            }
        }

    }

    &.level-2 {
        &:last-of-type:not(.is-expand) {
            &>.cus-node-title {
                border-bottom-color: transparent
            }
        }
    }


    .cus-node-title {
        height: 40px;
        display: flex;
        align-items: center;
        user-select: none;
        border-bottom: 1px solid transparent;
        transition: border-bottom-color 0.3s linear;

        .bot {
            width: 34px;
        }

        &.boderBottom {
            @extend .boderBottom;
        }

        .icon {
            color: #868686;
            margin: 0 10px;
            transition: transform 0.2s linear;

            &.expanded {
                transform: rotate(90deg);
            }
        }

        .title {
            margin: 0 10px;
            user-select: none;
            cursor: pointer;

            &.disabled {
                cursor: not-allowed;
                opacity: 0.5;
            }
        }
    }

    .cus-node-content {
        .content-container {
            will-change: height;

            &>div {
                display: flex;
                flex-wrap: wrap;
                background: $bgColor;
            }
        }
    }
}
</style>