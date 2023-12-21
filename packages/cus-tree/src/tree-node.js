import { ref, inject } from '@vue/composition-api'
export function useTreeNodeCom(props) {
    const tree = inject('tree')
    const expanded = ref(false)


    //处理展开事件
    function handleExpandClick() {
        // if (props.node.isLeaf) return;
        // if (expanded.value) {
        //     tree.value.$emit('node-collapse', props.node.data, props.node, nodeInstance.value);
        //     props.node.collapse();
        // } else {
        //     props.node.expand();
        //     tree.value.$emit('node-expand', props.node.data, props.node, nodeInstance.value);
        // }

        expanded.value = !expanded.value
    }

    return {
        expanded,
        handleExpandClick
    }
}