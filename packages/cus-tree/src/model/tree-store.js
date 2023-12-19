import Node from './node';
import { getNodeKey } from './utils'

export default class TreeStore {
    constructor(options) {
        this.currentNode = null;
        this.currentNodeKey = null;
        this.key = options.key;
        this.data = options.data;
        this.currentNodeKey = options.currentNodeKey;
        this.defaultCheckedKeys = options.defaultCheckedKeys;
        this.defaultExpandedKeys = options.defaultExpandedKeys;
        this.autoExpandParent = options.autoExpandParent;
        this.defaultExpandAll = options.defaultExpandAll;
        this.props = options.props;

        //设置node-key后，收集所有节点，用于默认展开和默认选中
        this.nodesMap = {};

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
        const nodesKey = Object.keys(nodesMap)


        nodesKey.forEach((k) => {
            const node = nodesMap[k];
            if (node) {
                node.setChecked(false, true);
            }
        })

        defaultCheckedKeys.forEach((checkedKey) => {
            const node = nodesMap[checkedKey];

            if (node) {
                node.setChecked(true, true);
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
        // const nodesKey = Object.keys(this.nodesMap)


        // nodesKey.forEach((k) => {
        //     const node = this.nodesMap[k];
        //     if (node) {
        //         node.collapse();
        //     }
        // })

        keys.forEach((key) => {
            const node = this.getNode(key);
            if (node) node.expand(null, this.autoExpandParent);
        });
    }
}