import { provide, getCurrentInstance, onMounted, ref, watch, nextTick } from '@vue/composition-api'
import TreeStore from './model/tree-store'

//tree抛出外部的方法
function useTreeMethods(store) {
    //获取选中节点的key
    function getCheckedKeys(leafOnly = false) {
        return store.value.getCheckedKeys(leafOnly)
    }
    //获取选中的节点
    function getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
        return store.value.getCheckedNodes(leafOnly, includeHalfChecked)
    }
    //获取半选中节点
    function getHalfCheckedNodes() {
        return store.value.getHalfCheckedNodes()
    }
    //获取半选中节点的key
    function getHalfCheckedKeys() {
        return store.value.getHalfCheckedKeys()
    }
    //设置选中或取消的节点(value为true选中，为false不选中)
    function setKeys(keys, value = true, leafOnly = false) {
        store.value.setKeys(keys, value, leafOnly)
    }
    //全选/全取消
    function setAll(val = true, leafOnly = false) {
        setKeys(store.value.keys, val, leafOnly)
    }
    //获取所有节点
    function getAllNodes() {
        return store.value._getAllNodes()
    }
    //设置展开/折叠 
    function setExpandedKeys(keys, isExpand = true) {
        store.value.setExpandedKeys(keys, isExpand)
    }
    //设置所有展开/折叠
    function setExpandedAll(val) {
        let nodes = getAllNodes();
        //防止高度突变，导致动画卡顿
        nodes.sort((a, b) => b.id - a.id)
        for (let node of nodes) {
            if (!node.isLeaf) {
                window.requestAnimationFrame(() => {
                    node.expanded = val
                })
            }
        }
    }

    return {
        getCheckedKeys,
        getCheckedNodes,
        getHalfCheckedNodes,
        getHalfCheckedKeys,
        setKeys,
        setAll,
        getAllNodes,
        setExpandedKeys,
        setExpandedAll
    }

}

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

    watch(() => props.defaultCheckedKeys, () => {
        store.value.setDefaultCheckedKey(newVal);
    })

    watch(() => props.defaultExpandedKeys, () => {
        store.value.setDefaultExpandedKeys(newVal);
    })

    watch(() => props.data, () => {
        store.value.setData(newVal);
    })

    return {
        store,
        root,
        ...useTreeMethods(store)
    }
}