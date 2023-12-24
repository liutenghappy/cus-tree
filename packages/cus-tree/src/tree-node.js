import { ref, inject, onMounted, computed, nextTick, watch, h, defineComponent } from '@vue/composition-api'
import { getNodeKey } from './model/utils'


//节点选中相关逻辑
function useChecked(props, tree) {
    const oldChecked = ref(false)
    const oldIndeterminate = ref(false)
    //处理选中事件
    function handleCheckChange(value, ev) {
        props.node.setChecked(ev.target.checked, true);
        nextTick(() => {
            const store = props.node.store;
            tree.$emit('check', props.node.data, {
                checkedNodes: store.getCheckedNodes(),
                checkedKeys: store.getCheckedKeys(),
                halfCheckedNodes: store.getHalfCheckedNodes(),
                halfCheckedKeys: store.getHalfCheckedKeys(),
            });
        })
    }
    //节点选中状态发生变化时向组件外抛出事件
    function handleSelectChange(checked, indeterminate) {
        if (oldChecked.value !== checked && oldIndeterminate.value !== indeterminate) {
            tree.$emit('check-change', props.node.data, checked, indeterminate);
        }
        oldChecked.value = checked;
        oldIndeterminate.value = indeterminate;
    }

    watch(() => props.node.checked, (val) => {
        handleSelectChange(val, props.node.indeterminate);
    })

    return {
        oldChecked,
        oldIndeterminate,
        handleCheckChange
    }
}

//节点样式
function useNodeStyle(props, tree, expanded) {
    //叶子节点样式
    const leafStyle = computed(() => {
        const base = Math.floor(100 / props.lineNum);
        if (!props.node.isLeaf) {
            return {
                flex: '1 0 100%'
            }
        } else {
            return {
                flex: `0 1 ${base}%`
            }
        }
    })


    //按层级缩进
    const indentStyle = computed(() => {
        let margin;
        const nodes = props.node.parentNode.childNodes;
        let i = props.index;
        if (!props.node.isLeaf) {
            margin = (props.node.level - 1) * tree.indent + 'px'
        } else {
            while (i >= 0) {
                i = i - 1
                if (!nodes[i]?.isLeaf) {
                    break
                }
            }
            if (i < 0) {
                if (props.index % props.lineNum === 0) {
                    margin = (props.node.level - 1) * tree.indent + 'px'
                } else {
                    margin = '0px'
                }
            } else {
                if ((props.index - i - 1) % props.lineNum === 0) {
                    margin = (props.node.level - 1) * tree.indent + 'px';
                } else {
                    margin = '0px'
                }
            }

        }

        return {
            'margin-left': margin
        }
    })

    return {
        leafStyle,
        indentStyle
    }
}

//节点展开逻辑
function useExpanded(props, tree, expanded, childNodeRendered) {
    //处理展开事件
    function handleExpandClick() {
        if (props.node.isLeaf) return;
        if (props.readOnly && props.node.level !== 1) return;
        if (expanded.value) {
            tree.$emit('node-collapse', props.node.data, props.node);
            props.node.collapse();
        } else {
            props.node.expand();
            tree.$emit('node-expand', props.node.data, props.node);
        }
    }
    watch(() => props.node.expanded, (val) => {
        if (val) {
            childNodeRendered.value = true;
        }
        nextTick(() => expanded.value = val);
    })

    return {
        handleExpandClick
    }
}



//节点插槽
export const nodeContent = defineComponent({
    inject: ['tree'],
    props: {
        node: {
            required: true
        }
    },
    render(h) {
        return h('span', {}, this.tree.$scopedSlots.default ?
            this.tree.$scopedSlots.default({ node: this.node }) :
            h('span', {}, this.node.label)
        )
    }
})


export function useTreeNodeCom(props) {
    //注入树组件
    const tree = inject('tree')
    const expanded = ref(false)
    const childNodeRendered = ref(false)
    const { handleCheckChange } = useChecked(props, tree)

    onMounted(() => {
        if (props.node.expanded) {
            expanded.value = true;
            childNodeRendered.value = true
        }
    })

    watch(() => props.readOnly, (val) => {
        if (val) {
            if (props.node.level !== 1) {
                props.node.expand(null, true)
            }
        }

    }, {
        immediate: true
    })



    //处理点击事件
    function handleClick() {
        const store = props.node.store;
        store.setCurrentNode(props.node);
        if (props.node.isLeaf && !props.readOnly) {
            handleCheckChange(null, {
                target: { checked: !this.node.checked }
            });
        }
    }





    //获取key
    function getKey(node) {
        return getNodeKey(node.store.key, node.data);
    }

    return {
        expanded,
        childNodeRendered,
        getKey,
        handleClick,
        handleCheckChange,
        ...useNodeStyle(props, tree, expanded),
        ...useExpanded(props, tree, expanded, childNodeRendered),
        // ...useNodeContent(props, tree)
    }
}