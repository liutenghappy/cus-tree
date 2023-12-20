
let nodeIdSeed = 0;


export const getChildState = node => {
    let all = true;
    let none = true;
    let allWithoutDisable = true;
    for (let i = 0, j = node.length; i < j; i++) {
        const n = node[i];
        if (n.checked !== true || n.indeterminate) {
            all = false;
            if (!n.disabled) {
                allWithoutDisable = false;
            }
        }
        if (n.checked !== false || n.indeterminate) {
            none = false;
        }
    }

    return { all, none, allWithoutDisable, half: !all && !none };
};


const reInitChecked = function (node) {
    if (node.childNodes.length === 0 || node.loading) return;

    const { all, none, half } = getChildState(node.childNodes);
    if (all) {
        node.checked = true;
        node.indeterminate = false;
    } else if (half) {
        node.checked = false;
        node.indeterminate = true;
    } else if (none) {
        node.checked = false;
        node.indeterminate = false;
    }

    const parent = node.parentNode;
    if (!parent || parent.level === 0) return;

    reInitChecked(parent);
};

//自定义children,disabled,label对应的字段
const getPropertyFromData = function (node, prop) {
    const props = node.store.props;
    const data = node.data || {};
    const config = props[prop];

    if (typeof config === 'function') {
        return config(data, node);
    } else if (typeof config === 'string') {
        return data[config];
    } else if (typeof config === 'undefined') {
        const dataProp = data[prop];
        return dataProp === undefined ? '' : dataProp;
    }
};

export default class Node {
    constructor(options) {
        this.id = nodeIdSeed++;
        this.text = null;
        this.level = 0;
        this.checked = false;
        this.indeterminate = false;
        this.data = null;
        this.expanded = false;
        this.parentNode = null;
        this.childNodes = [];
        //是否为叶子节点
        this.isLeaf = false;
        //是否为当前节点
        this.isCurrent = false;

        for (let name in options) {
            if (options.hasOwnProperty(name)) {
                this[name] = options[name];
            }
        }


        if (this.parentNode) {
            this.level = this.parentNode.level + 1;
        }

        const store = this.store;
        if (!store) {
            throw new Error('[Node]store is required!');
        }
        store.registerNode(this);

        if (this.data) {
            this.setData(this.data);
            if (store.defaultExpandAll) {
                this.expanded = true;
            }
        } else if (this.level > 0 && store.defaultExpandAll) {
            this.expand();
        }

        if (!this.data) return;
        const defaultExpandedKeys = store.defaultExpandedKeys;
        const key = store.key;
        if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
            this.expand(null, store.autoExpandParent);
        }

        if (key && store.currentNodeKey !== undefined && this.key === store.currentNodeKey) {
            store.currentNode = this;
            store.currentNode.isCurrent = true;
        }
    }

    get label() {
        return getPropertyFromData(this, 'label');
    }

    get key() {
        const nodeKey = this.store.key;
        if (this.data) return this.data[nodeKey];
        return null;
    }

    get disabled() {
        return getPropertyFromData(this, 'disabled');
    }

    //初始化数据
    setData(data) {
        this.data = data;
        this.childNodes = [];

        let children;
        if (this.level === 0 && this.data instanceof Array) {
            children = this.data;
        } else {
            children = this.data.children || [];
        }

        if (children.length === 0) {
            this.isLeaf = true
        }

        for (let i = 0, j = children.length; i < j; i++) {
            this.insertChild({ data: children[i] });
        }
    }


    //插入节点
    insertChild(child, index) {
        if (!child) throw new Error('child是必需的');

        if (!(child instanceof Node)) {
            child = Object.assign(child, {
                parentNode: this,
                store: this.store
            });
            child = new Node(child);
        }

        this.store.count += 1

        child.level = this.level + 1;

        if (typeof index === 'undefined' || index < 0) {
            this.childNodes.push(child);
        } else {
            this.childNodes.splice(index, 0, child);
        }
    }

    //设置选中
    setChecked(value, deep, recursion, passValue) {
        this.indeterminate = value === 'half';
        this.checked = this.disabled ? this.checked : value === true;


        let { all, allWithoutDisable } = getChildState(this.childNodes);

        if (!all && allWithoutDisable) {
            this.checked = false;
            value = false;
        }

        const handleDescendants = () => {
            if (deep) {
                const childNodes = this.childNodes;
                for (let i = 0, j = childNodes.length; i < j; i++) {
                    const child = childNodes[i];
                    passValue = passValue || value !== false;
                    const isCheck = child.disabled ? child.checked : passValue;
                    child.setChecked(isCheck, deep, true, passValue);
                }
                const { half, all } = getChildState(childNodes);
                if (!all) {
                    this.checked = all;
                    this.indeterminate = half;
                }
            }
        };
        handleDescendants();
        const parent = this.parentNode;
        if (!parent || parent.level === 0) return;

        if (!recursion) {
            reInitChecked(parent);
        }
    }

    //展开
    expand(callback, expandParent) {
        const done = () => {
            //是否展开父节点
            if (expandParent) {
                let parent = this.parentNode;
                while (parent.level > 0) {
                    parent.expanded = true;
                    parent = parent.parentNode;
                }
            }
            this.expanded = true;
            if (callback) callback();
        };
        done();
    }

    //折叠
    collapse() {
        this.expanded = false;
    }
}