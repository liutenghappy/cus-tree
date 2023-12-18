import Node from './node';

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

        this.nodesMap = {};

        this.root = new Node({
            data: this.data,
            store: this
        });

        this._initDefaultCheckedNodes();
    }

    _initDefaultCheckedNodes() {
        const defaultCheckedKeys = this.defaultCheckedKeys || [];
        const nodesMap = this.nodesMap;

        defaultCheckedKeys.forEach((checkedKey) => {
            const node = nodesMap[checkedKey];

            if (node) {
                node.setChecked(true, true);
            }
        });
    }

    registerNode(node) {
        const key = this.key;
        if (!key || !node || !node.data) return;

        const nodeKey = node.key;
        if (nodeKey !== undefined) this.nodesMap[node.key] = node;
    }
}