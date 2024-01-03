import { ref, inject, onMounted, computed, nextTick, watch, h, defineComponent } from '@vue/composition-api'

const NODE_KEY = '$treeNodeId';

let nodeIdSeed = 0;

//获取key值
export const getNodeKey = function (key, data) {
    if (!key) return data[NODE_KEY];
    return data[key];
};

//获取子节点的状态
export const getChildState = node => {
    //全选
    let all = true;
    //没有选中
    let none = true;
    //全禁止
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

//递归处理父节点状态
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

//节点类
export class Node {
    constructor(options) {
        this.id = nodeIdSeed++;
        this.level = 0;
        //选中
        this.checked = false;
        //半选
        this.indeterminate = false;
        //数据
        this.data = null;
        this.expanded = false;
        this.parentNode = null;
        this.childNodes = [];
        //是否为叶子节点
        this.isLeaf = false;

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
            throw new Error('store必须存在');
        }
        //注册节点至nodeMap
        store.registerNode(this);

        if (this.data) {
            this.setData(this.data);
        }

        if (store.defaultExpandAll) {
            this.expanded = true;
        }

        if (!this.data) return;

        const defaultExpandedKeys = store.defaultExpandedKeys;
        const key = store.key;

        //默认展开
        if (key && defaultExpandedKeys && defaultExpandedKeys.indexOf(this.key) !== -1) {
            this.expand();
        }
    }

    get label() {
        return this.data.name
    }

    get key() {
        const nodeKey = this.store.key;
        if (this.data) return this.data[nodeKey];
        return null;
    }

    get disabled() {
        return this.data.disabled
    }

    //初始化数据
    setData(data) {
        this.data = data;
        this.childNodes = [];

        let children;
        if (this.level === 0 && this.data instanceof Array) {
            children = this.data;
        } else {
            children = this.data.childList || []
        }

        if (children.length === 0) {
            this.isLeaf = true
        }

        for (let i = 0, j = children.length; i < j; i++) {
            this.insertChild({ data: children[i] });
        }
    }


    //插入节点
    insertChild(child) {
        if (!child) throw new Error('child是必需的');

        if (!(child instanceof Node)) {
            child = Object.assign(child, {
                parentNode: this,
                store: this.store
            });
            child = new Node(child);
        }

        this.store.count += 1;

        const key = this.key;
        if (key != undefined) {
            this.store.keys.push(key)
        }

        child.level = this.level + 1;
        this.childNodes.push(child);
    }

    //设置选中
    setChecked(value) {
        this.indeterminate = value === 'half';
        this.checked = this.disabled ? this.checked : value === true;
        let { all, allWithoutDisable } = getChildState(this.childNodes);
        if (!all && allWithoutDisable) {
            this.checked = false;
            value = false;
        }
        //递归处理子节点的选中
        const handleDescendants = () => {
            const childNodes = this.childNodes;
            for (let i = 0, j = childNodes.length; i < j; i++) {
                const child = childNodes[i];
                const isCheck = child.disabled ? child.checked : value !== false;
                child.setChecked(isCheck);
            }
            const { half, all } = getChildState(childNodes);
            if (!all) {
                this.checked = all;
                this.indeterminate = half;
            }
        };
        handleDescendants();
        const parent = this.parentNode;
        if (!parent || parent.level === 0) return;
        //递归处理父节点的选中
        reInitChecked(parent);
    }

    //展开(默认展开父节点)
    expand() {
        const done = () => {
            this.expanded = true;

            function rdone(node) {
                let parent = node.parentNode
                if (parent.level > 0) {
                    parent.expanded = true;
                    window.requestAnimationFrame(() => rdone(parent))
                }
            }

            window.requestAnimationFrame(() => rdone(this))
        };
        done();
    }

    //折叠
    collapse() {
        this.expanded = false;
    }
}


//节点选中相关逻辑
function useChecked(props) {
    //处理选中事件
    const checked = ref(false)
    function handleCheckChange(value, ev) {
        props.node.setChecked(ev.target.checked);
        checked.value = props.node.checked
    }
    watch(() => props.node.checked, (val) => {
        checked.value = val;
    })
    return {
        checked,
        handleCheckChange
    }
}

//节点样式
function useNodeStyle(props, tree) {
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
                if (nodes[i] && !nodes[i].isLeaf) {
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
function useExpanded(props, expanded, childNodeRendered) {
    //处理展开事件
    function handleExpandClick() {
        if (props.node.isLeaf) return;
        if (props.readOnly && props.node.level !== 1) return;
        if (expanded.value) {
            props.node.collapse();
        } else {
            props.node.expand();
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

    const { handleCheckChange, checked } = useChecked(props)

    onMounted(() => {
        if (props.node.expanded) {
            expanded.value = true;
            childNodeRendered.value = true
        }
        if (props.node.checked) {
            checked.value = true
        }
    })

    watch(() => props.readOnly, (val) => {
        if (val) {
            if (props.node.level !== 1) {
                props.node.expand()
            }
        }
    }, {
        immediate: true
    })

    //处理点击事件
    function handleClick() {
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
        checked,
        childNodeRendered,
        getKey,
        handleClick,
        handleCheckChange,
        ...useNodeStyle(props, tree),
        ...useExpanded(props, expanded, childNodeRendered),
    }
}