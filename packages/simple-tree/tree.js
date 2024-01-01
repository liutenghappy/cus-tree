import { provide, getCurrentInstance, onMounted, ref, watch } from '@vue/composition-api'
import { Node, getNodeKey } from './node.js'


class TreeStore {
    constructor(options) {
        this.key = options.key;
        this.data = options.data;
        this.defaultCheckedKeys = options.defaultCheckedKeys;
        this.defaultExpandedKeys = options.defaultExpandedKeys;
        this.defaultExpandAll = options.defaultExpandAll;
        //总节点数
        this.count = 0
        //设置node-key后，收集所有节点，用于默认展开和默认选中
        this.nodesMap = {};
        //新增节点
        this.newNodes = []
        //所有key的集合
        this.keys = []
        this.root = new Node({
            data: this.data,
            store: this
        });

        this._initDefaultCheckedNodes();
    }

    //初始化默认选中
    _initDefaultCheckedNodes() {
        const defaultCheckedKeys = this.defaultCheckedKeys || [];
        const nodesMap = this.nodesMap;

        defaultCheckedKeys.forEach((checkedKey) => {
            const node = nodesMap[checkedKey];

            if (node) {
                node.setChecked(true);
            }
        });
    }

    //获取节点
    getNode(data) {
        if (data instanceof Node) return data;
        const key = typeof data !== 'object' ? data : getNodeKey(this.key, data);
        return this.nodesMap[key] || null;
    }

    registerNode(node) {
        const key = this.key;
        if (!key || !node || !node.data) return;

        const nodeKey = node.key;
        if (node.data.new) this.newNodes.push(node)
        if (nodeKey !== undefined) this.nodesMap[node.key] = node;
    }

    //设置默认选中
    setDefaultCheckedKey(newVal) {
        if (newVal !== this.defaultCheckedKeys) {
            this.defaultCheckedKeys = newVal;
            this._initDefaultCheckedNodes();
        }
    }

    //设置默认展开
    setDefaultExpandedKeys(keys) {
        keys = keys || [];
        this.defaultExpandedKeys = keys;
        keys.forEach((key) => {
            const node = this.getNode(key);
            if (node) node.expand();
        });
    }

    //获取选中的节点(默认不包括半选)
    getCheckedNodes(leafOnly = false) {
        const checkedNodes = [];
        const traverse = function (node) {
            const childNodes = node.childNodes;

            childNodes.forEach((child) => {
                if ((child.checked) && (!leafOnly || (leafOnly && child.isLeaf))) {
                    checkedNodes.push(child.data);
                }

                traverse(child);
            });
        };
        traverse(this.root);
        return checkedNodes;
    }

    //获取选中节点的key
    getCheckedKeys(leafOnly = false) {
        return this.getCheckedNodes(leafOnly).map((data) => (data || {})[this.key]);
    }
    //设置展开/折叠 
    setExpandedKeys(keys, isExpand = true) {
        keys = keys || [];
        //防止高度突变，导致动画卡顿
        keys.sort((a, b) => b - a)
        keys.forEach((key) => {
            const node = this.getNode(key);
            if (node && !node.isLeaf) {
                if (isExpand) {
                    node.expand();
                } else {
                    node.collapse()
                }
            }
        });
    }
    //获取所有节点
    _getAllNodes() {
        const allNodes = [];
        const nodesMap = this.nodesMap;
        for (let nodeKey in nodesMap) {
            if (nodesMap.hasOwnProperty(nodeKey)) {
                allNodes.push(nodesMap[nodeKey]);
            }
        }
        return allNodes;
    }
}

//tree抛出外部的方法
function useTreeMethods(store) {
    //获取选中节点的key
    function getCheckedKeys(leafOnly = false) {
        return store.value.getCheckedKeys(leafOnly)
    }
    //获取所有节点
    function getAllNodes() {
        return store.value._getAllNodes()
    }
    //设置展开/折叠 
    function setExpandedKeys(keys, isExpand = true) {
        store.value.setExpandedKeys(keys, isExpand)
    }

    return {
        getCheckedKeys,
        getAllNodes,
        setExpandedKeys,
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
            defaultCheckedKeys: props.defaultCheckedKeys,
            defaultExpandedKeys: props.defaultExpandedKeys,
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