import { provide, getCurrentInstance, onMounted, ref } from '@vue/composition-api'
import TreeStore from './model/tree-store'

export function useTreeWrap(props) {
    const tree = getCurrentInstance();
    provide('tree', tree.proxy)

    const store = ref({})
    const root = ref(null)

    onMounted(() => {
        store.value = new TreeStore({
            key: props.nodeKey,
            data: props.data,
            props: props.props,
            currentNodeKey: props.currentNodeKey,
            defaultCheckedKeys: props.defaultCheckedKeys,
            defaultExpandedKeys: props.defaultExpandedKeys,
            autoExpandParent: props.autoExpandParent,
            defaultExpandAll: props.defaultExpandAll,
        });
        root.value = store.value.root;
    })

    return {
        store,
        root
    }
}