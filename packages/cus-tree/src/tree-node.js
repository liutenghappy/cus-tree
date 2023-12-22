import { ref, inject, onMounted, getCurrentInstance, computed, nextTick, watch } from '@vue/composition-api'
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
    //节点选中状态发生变化时向组件抛出事件
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



export function useTreeNodeCom(props) {
    //注入树组件
    const tree = inject('tree')
    const nodeInstance = getCurrentInstance().proxy
    const expanded = ref(false)
    const childNodeRendered = ref(false)

    const { handleCheckChange } = useChecked(props, tree)

    onMounted(() => {
        if (props.node.expanded) {
            expanded.value = true;
            childNodeRendered.value = true
        }
    })

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
        const margin = (props.node.level - 1) * tree.indent + 'px'
        return {
            'margin-left': margin
        }
    })

    //处理点击事件
    function handleClick() {
        const store = props.node.store;
        store.setCurrentNode(props.node);
        if (props.node.isLeaf) {
            handleCheckChange(null, {
                target: { checked: !this.node.checked }
            });
        }
    }

    //处理展开事件
    function handleExpandClick() {
        if (props.node.isLeaf) return;
        if (expanded.value) {
            tree.$emit('node-collapse', props.node.data, props.node, nodeInstance);
            props.node.collapse();
        } else {
            props.node.expand();
            tree.$emit('node-expand', props.node.data, props.node, nodeInstance);
        }

        expanded.value = !expanded.value
    }



    //获取key
    function getKey(node) {
        return getNodeKey(node.store.key, node.data);
    }

    return {
        expanded,
        leafStyle,
        indentStyle,
        getKey,
        handleExpandClick,
        handleClick,
        handleCheckChange
    }
}