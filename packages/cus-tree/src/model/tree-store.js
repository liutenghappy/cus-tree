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
        //总节点数
        this.count = 0

        //设置node-key后，收集所有节点，用于默认展开和默认选中
        this.nodesMap = {};
        //新增节点
        this.newNodes = []

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
        // const nodesKey = Object.keys(nodesMap)


        // nodesKey.forEach((k) => {
        //     const node = nodesMap[k];
        //     if (node) {
        //         node.setChecked(false, true);
        //     }
        // })

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

    //获取选中的节点
    getCheckedNodes(leafOnly = false, includeHalfChecked = false) {
        const checkedNodes = [];
        const traverse = function (node) {
            const childNodes = node.childNodes;

            childNodes.forEach((child) => {
                if ((child.checked || (includeHalfChecked && child.indeterminate)) && (!leafOnly || (leafOnly && child.isLeaf))) {
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

    //获取半选中节点
    getHalfCheckedNodes() {
        const nodes = [];
        const traverse = function (node) {
            const childNodes = node.childNodes;

            childNodes.forEach((child) => {
                if (child.indeterminate) {
                    nodes.push(child.data);
                }

                traverse(child);
            });
        };

        traverse(this.root);

        return nodes;
    }

    //获取半选中节点的key
    getHalfCheckedKeys() {
        return this.getHalfCheckedNodes().map((data) => (data || {})[this.key]);
    }

    //设置当前节点
    setCurrentNode(currentNode) {
        const prevCurrentNode = this.currentNode;
        if (prevCurrentNode) {
            prevCurrentNode.isCurrent = false;
        }
        this.currentNode = currentNode;
        this.currentNode.isCurrent = true;
    }

    //设置选中的节点(value为true选中，为false不选中)
    setCheckedKeys(keys, value = true, leafOnly = false) {
        this.defaultCheckedKeys = keys;
        const key = this.key;
        const checkedKeys = {};
        keys.forEach((key) => {
            checkedKeys[key] = true;
        });

        this._setCheckedKeys(key, value, leafOnly, checkedKeys);
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

    _setCheckedKeys(key, value, leafOnly = false, checkedKeys) {
        const allNodes = this._getAllNodes().sort((a, b) => b.level - a.level);
        const cache = Object.create(null);
        const keys = Object.keys(checkedKeys);
        allNodes.forEach(node => node.setChecked(false, false));
        for (let i = 0, j = allNodes.length; i < j; i++) {
            const node = allNodes[i];
            const nodeKey = node.data[key].toString();
            let checked = keys.indexOf(nodeKey) > -1;
            if (!checked && value) {
                if (node.checked && !cache[nodeKey]) {
                    node.setChecked(false, false);
                }
                continue;
            }

            let parent = node.parentNode;
            while (parent && parent.level > 0) {
                cache[parent.data[key]] = true;
                parent = parent.parentNode;
            }

            if (node.isLeaf) {
                node.setChecked(value, false);
                continue;
            }
            node.setChecked(value, true);

            if (leafOnly) {
                node.setChecked(false, false);
                const traverse = function (node) {
                    const childNodes = node.childNodes;
                    childNodes.forEach((child) => {
                        if (!child.isLeaf) {
                            child.setChecked(false, false);
                        }
                        traverse(child);
                    });
                };
                traverse(node);
            }
        }
    }


}