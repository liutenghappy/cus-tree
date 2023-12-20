export const NODE_KEY = '$treeNodeId';


export const getNodeKey = function (key, data) {
    if (!key) return data[NODE_KEY];
    return data[key];
};